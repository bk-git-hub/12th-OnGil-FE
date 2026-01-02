import { useState, useEffect, useRef } from 'react'

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (ev: SpeechRecognitionEvent) => void
  onend: () => void
  onerror: (ev: SpeechRecognitionErrorEvent) => void
  start: () => void
  stop: () => void
  abort: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export const useSpeechToText = (lang: string = 'ko-KR') => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimText, setInterimText] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 녹음 중지 핸들러
  const handleStop = () => {
    recognitionRef.current?.stop()
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

    setStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop())
      return null
    })
    setIsListening(false)
  }

  //타이머 초기화 함수 타이머 만료시 handle stop 호출
  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    silenceTimerRef.current = setTimeout(() => {
      handleStop()
    }, 2000) //2초
  }

  //녹음 시작 핸들러
  const handleStart = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition //브라우저마다 객체 이름이 달라서 두개의 객체 모두 체크
    if (!SpeechRecognition) {
      alert('이 브라우저는 음성 인식을 지원하지 않습니다.')
      return
    }

    try {
      //마이크 접근
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      setStream(audioStream)

      //stt 객체 생성 (start 후 이벤트 객체가 변환 결과 반환. 이를 onresult에서 처리)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = lang

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        resetSilenceTimer()

        let final = ''
        let interim = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) final += result[0].transcript
          else interim += result[0].transcript
        }

        if (final) setTranscript((prev) => prev + final + ' ')
        setInterimText(interim)
      }

      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => handleStop()

      recognitionRef.current = recognition
      recognition.start()
      setIsListening(true)
      resetSilenceTimer()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    isListening,
    transcript,
    interimText,
    stream,
    start: handleStart,
    stop: handleStop,
    setTranscript,
  }
}

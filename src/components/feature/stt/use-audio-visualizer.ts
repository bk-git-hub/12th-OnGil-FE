import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

interface UseAudioVisualizerProps {
  stream: MediaStream | null
  isListening: boolean
  barsRef: React.RefObject<(HTMLDivElement | null)[]>
  rippleRef: React.RefObject<HTMLDivElement | null>
}

export const useAudioVisualizer = ({
  stream,
  isListening,
  barsRef,
  rippleRef,
}: UseAudioVisualizerProps) => {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    let audioContext: AudioContext | null = null
    let dataArray: Uint8Array<ArrayBuffer> | null = null

    if (isListening && stream) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      audioContext = new AudioContextClass()

      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()

      analyser.fftSize = 128
      /**
       * [최적화 1: 스무딩 강화]
       * 값을 0.5~0.6 정도로 올리면 신호의 급격한 변화(잡음)를 억제하고
       * 목소리의 흐름을 더 부드럽게 파악합니다.
       */
      analyser.smoothingTimeConstant = 0.5

      source.connect(analyser)
      analyserRef.current = analyser
      dataArray = new Uint8Array(analyser.frequencyBinCount)
    }

    const animate = (time: number) => {
      let volume = 0

      if (analyserRef.current && dataArray) {
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0

        /**
         * [최적화 2: 주파수 하한선 상향]
         * 인덱스 0~4 정도의 초저역대(전기 노이즈, 웅웅거리는 소리)를 제외하고
         * 5번(약 800Hz) 이후부터 감지하여 주변 소음 영향을 줄입니다.
         */
        const start = 5
        const end = 35
        for (let j = start; j < end; j++) {
          sum += dataArray[j]
        }
        volume = sum / (end - start) / 255
      }

      /**
       * [최적화 3: 임계값(Threshold) 및 노이즈 필터]
       * - VOLUME_THRESHOLD: 이 값보다 작으면 무조건 '무음'으로 간주합니다.
       * - 기존 0.05에서 0.1 ~ 0.15 정도로 높이면 작은 소음은 무시됩니다.
       */
      const VOLUME_THRESHOLD = 0.12

      // 소리가 임계값을 넘었을 때만 목소리로 인정
      const isSpeaking = volume > VOLUME_THRESHOLD

      // 실제 애니메이션에 사용할 볼륨 수치 (임계값을 뺀 나머지 에너지만 증폭)
      const activeVolume = isSpeaking ? (volume - VOLUME_THRESHOLD) * 3.0 : 0

      if (barsRef.current) {
        barsRef.current.forEach((bar, i) => {
          if (!bar) return

          let finalScale = 0

          if (isSpeaking) {
            // [목소리 감지됨]
            // 기본 높이에 '순수 목소리 에너지'만 더함
            finalScale = Math.min(1.0, 0.2 + activeVolume)
          } else {
            // [소음 또는 무음]
            // 잔잔한 Idle 웨이브 유지
            const wave = Math.sin(time / 250 - i * 1.0)
            finalScale = 0.2 + wave * 0.08
          }

          bar.style.transform = `scaleY(${finalScale})`
        })
      }

      if (rippleRef.current) {
        // 파형도 확실히 말을 할 때만 튀도록 변경
        const rippleScale = 1 + activeVolume * 1.2
        rippleRef.current.style.transform = `scale(${rippleScale})`
        rippleRef.current.style.opacity =
          isListening && isSpeaking ? `${Math.max(0, 0.4 - activeVolume)}` : '0'
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error)
      }
      analyserRef.current = null
    }
  }, [isListening, stream, barsRef, rippleRef])
}

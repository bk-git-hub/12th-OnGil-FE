import { useState, useRef, useEffect } from 'react';

interface UseSpeechProps {
  onStart?: () => void;
  onEnd?: () => void;
  onFinalResult: (transcript: string) => void;
  onClose: () => void; // 부모의 상태를 닫기 위해 필수
}

const SILENCE_TIME = 2000;

export const useSpeechRecognition = ({
  onStart,
  onEnd,
  onFinalResult,
  onClose,
}: UseSpeechProps) => {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef(''); // 타이머 클로저 문제 해결용

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    clearTimer();
    onEnd?.();
  };

  // 3초 침묵 시 실행될 함수
  const handleSilenceTimeout = () => {
    onFinalResult(transcriptRef.current); // 최종 텍스트 전달
    stop(); // 하드웨어 정지
    onClose(); // 부모 UI 닫기
  };

  const start = () => {
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionClass) return alert('지원하지 않는 브라우저입니다.');

    const recognition = new RecognitionClass();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true; // 문장 판단과 상관없이 계속 듣기

    recognition.onstart = () => {
      setTranscript('');
      transcriptRef.current = '';
      onStart?.();
      // 시작하자마자 3초 타이머 가동 (아무 말 안 할 경우 대비)
      clearTimer();
      timerRef.current = setTimeout(handleSilenceTimeout, SILENCE_TIME);
    };

    recognition.onresult = (e) => {
      const current = Array.from(e.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(current);
      transcriptRef.current = current;

      // 소리가 입력될 때마다 타이머 3초 리셋
      clearTimer();
      timerRef.current = setTimeout(handleSilenceTimeout, SILENCE_TIME);
    };

    recognition.onerror = () => stop();
    recognition.onend = () => onEnd?.();

    recognition.start();
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  return { transcript, start, stop };
};

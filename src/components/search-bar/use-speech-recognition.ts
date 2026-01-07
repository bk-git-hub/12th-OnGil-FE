import { useState, useRef, useEffect } from 'react';

interface UseSpeechProps {
  onFinalResult: (transcript: string) => void;
  onClose: () => void;
}

const SILENCE_TIME = 2000;

export const useSpeechRecognition = ({
  onFinalResult,
  onClose,
}: UseSpeechProps) => {
  const [transcript, setTranscript] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef(''); // 확정된 텍스트 누적
  const latestTextRef = useRef(''); // 비동기 타이머 참조용 (state 불일치 방지)

  useEffect(() => {
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionClass) {
      alert('지원하지 않는 브라우저입니다.');
      onClose();
      return;
    }

    const recognition = new RecognitionClass();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = false;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const finalOutput = latestTextRef.current.trim();
        if (finalOutput) onFinalResult(finalOutput);
        onClose();
      }, SILENCE_TIME);
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) finalTranscriptRef.current += res[0].transcript;
        else interim += res[0].transcript;
      }

      const combined = (finalTranscriptRef.current + interim).trim();

      // UI 업데이트와 비동기 참조용 Ref를 동시 갱신
      setTranscript(combined);
      latestTextRef.current = combined;
      resetTimer();
    };

    recognition.onerror = () => onClose();
    recognition.onend = () => {
      /* 필요 시 재시작 로직 추가 가능 */
    };

    recognition.start();
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      recognition.stop();
    };
    // 리액트 컴파일러가 onFinalResult, onClose의 identity를 보장하므로 안전함
  }, [onFinalResult, onClose]);

  return { transcript };
};

import { useState, useRef, useEffect } from 'react';

interface UseSpeechProps {
  onFinalResult: (transcript: string) => void;
  onClose: () => void;
}

const SILENCE_TIME = 2000;

/**
 * Custom hook for speech recognition functionality.
 * 
 * @param props - Configuration object containing:
 *   onFinalResult - Callback when final transcript is ready
 *   onClose - Callback to close the speech recognition interface
 * @returns An object containing:
 *   transcript - The current speech recognition transcript
 */
export const useSpeechRecognition = ({
  onFinalResult,
  onClose,
}: UseSpeechProps) => {
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 음성 인식 엔진의 생명주기 관리 (Mount 시 시작, Unmount 시 종료)
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

    recognition.onresult = (event) => {
      // event.results는 현재 세션의 모든 결과를 포함하므로 별도의 Ref 누적이 필요 없음
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };

    recognition.onerror = () => onClose();

    // 컴포넌트 마운트 시 즉시 시작
    recognition.start();

    // 언마운트 시 엔진 중단 (VoiceOverlay가 사라지면 자동으로 꺼짐)
    return () => {
      recognition.stop();
    };
  }, [onClose]);

  // 침묵 타이머 관리 (반응형 로직)
  // transcript가 업데이트될 때마다 이 Effect가 실행되어 타이머를 리셋함
  useEffect(() => {
    if (!transcript) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onFinalResult(transcript.trim());
      onClose();
    }, SILENCE_TIME);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [transcript, onFinalResult, onClose]);

  return { transcript };
};

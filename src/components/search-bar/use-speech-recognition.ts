import { useState, useRef, useEffect } from 'react';

interface UseSpeechProps {
  onStart?: () => void;
  onEnd?: () => void;
  onFinalResult: (transcript: string) => void;
  onClose: () => void;
}

const SILENCE_TIME = 2000; // 2초 침묵 시 종료

export const useSpeechRecognition = ({
  onStart,
  onEnd,
  onFinalResult,
  onClose,
}: UseSpeechProps) => {
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');

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

  const handleSilenceTimeout = () => {
    onFinalResult(transcriptRef.current);
    stop();
    onClose();
  };

  const start = () => {
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionClass) return alert('지원하지 않는 브라우저입니다.');

    const recognition = new RecognitionClass();
    recognitionRef.current = recognition;

    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setTranscript('');
      transcriptRef.current = '';
      onStart?.();
      clearTimer();
      timerRef.current = setTimeout(handleSilenceTimeout, SILENCE_TIME);
    };

    recognition.onresult = (e) => {
      const current = Array.from(e.results)
        .map((result) => result[0].transcript)
        .join('');

      setTranscript(current);
      transcriptRef.current = current;

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

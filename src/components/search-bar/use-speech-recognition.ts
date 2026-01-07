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
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isStarted = useRef(false);
  const transcriptRef = useRef('');
  const callbacks = useRef({ onFinalResult, onClose });

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSilenceTimeout = () => {
    callbacks.current.onFinalResult(transcriptRef.current);
    stop();
    callbacks.current.onClose();
  };

  const stop = () => {
    clearTimer();
    if (recognitionRef.current && isStarted.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        recognitionRef.current.abort();
      }
      isStarted.current = false;
    }
  };

  const start = () => {
    const RecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!RecognitionClass) return alert('지원하지 않는 브라우저입니다.');
    if (isStarted.current) return;

    const recognition = new RecognitionClass();
    recognitionRef.current = recognition;
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      isStarted.current = true;
      setTranscript('');
      transcriptRef.current = '';
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
    recognition.onend = () => {
      isStarted.current = false;
    };

    recognition.start();
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { transcript, start, stop };
};

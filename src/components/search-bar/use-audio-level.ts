import { useRef, useEffect } from 'react';

export const useAudioLevel = (onLevelChange: (level: number) => void) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);

  const stopAnalysis = () => {
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }
    onLevelChange(0); // 초기화
  };

  const startAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioContextClass = window.AudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const analyze = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const norm = (dataArray[i] - 128) / 128;
          sum += norm * norm;
        }
        const level = Math.min(Math.sqrt(sum / dataArray.length) * 4, 1.5);

        // 상태를 바꾸지 않고 콜백 실행 (DOM 직접 조작용)
        onLevelChange(level);

        animationFrameRef.current = requestAnimationFrame(analyze);
      };
      analyze();
    } catch (err) {
      console.error('Audio analysis error:', err);
    }
  };

  useEffect(() => {
    return () => stopAnalysis();
  });

  return { startAnalysis, stopAnalysis };
};

import { useRef } from 'react';
import { useAudioVisualizer } from './use-audio-visualizer';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isListening: boolean;
}

export const AudioVisualizer = ({
  stream,
  isListening,
}: AudioVisualizerProps) => {
  // 훅에 전달할 Ref 생성
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rippleRef = useRef<HTMLDivElement>(null);

  // 비즈니스 로직 주입
  useAudioVisualizer({
    stream,
    isListening,
    barsRef,
    rippleRef,
  });

  return (
    <>
      {/* 배경 파형 */}
      <div
        ref={rippleRef}
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-blue-400"
        style={{
          filter: 'blur(12px)',
          willChange: 'transform, opacity',
          transition: 'transform 100ms ease-out',
        }}
      />

      {/* 3개 막대 컨테이너 */}
      <div className="z-20 flex h-10 w-10 items-center justify-center gap-1.5 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              barsRef.current[i] = el;
            }}
            className="h-full w-1.5 rounded-full bg-white"
            style={{
              transform: 'scaleY(0.2)',
              willChange: 'transform',
              maxHeight: '100%',
              transition: 'transform 75ms ease-out',
            }}
          />
        ))}
      </div>
    </>
  );
};

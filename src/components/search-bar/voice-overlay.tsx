import { useRef, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useSpeechRecognition } from './use-speech-recognition';
import { useAudioLevel } from './use-audio-level';

interface VoiceOverlayProps {
  isListening: boolean;
  onClose: () => void;
  onFinalResult: (text: string) => void;
}
export const VoiceOverlay = ({
  isListening,
  onClose,
  onFinalResult,
}: VoiceOverlayProps) => {
  const rippleOuterRef = useRef<HTMLDivElement>(null);
  const rippleInnerRef = useRef<HTMLDivElement>(null);

  const { startAnalysis, stopAnalysis } = useAudioLevel((level) => {
    if (rippleOuterRef.current)
      rippleOuterRef.current.style.transform = `scale(${1 + level * 0.8})`;
    if (rippleInnerRef.current)
      rippleInnerRef.current.style.transform = `scale(${1 + level * 0.5})`;
  });

  const { transcript, start, stop } = useSpeechRecognition({
    onStart: startAnalysis,
    onEnd: stopAnalysis,
    onFinalResult, //  침묵 시 호출됨
    onClose, //  침묵 시 부모를 닫기 위해 호출됨
  });

  useEffect(() => {
    if (isListening) start();
    else stop();
  }, [isListening, start, stop]);

  if (!isListening) return null;

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/80 p-6 text-white backdrop-blur-xl">
      <div className="relative mb-12 flex items-center justify-center">
        <div
          ref={rippleOuterRef}
          className="absolute rounded-full bg-red-500/10 transition-transform duration-100 ease-out"
          style={{ width: '180px', height: '180px', willChange: 'transform' }}
        />
        <div
          ref={rippleInnerRef}
          className="absolute rounded-full bg-red-500/20 transition-transform duration-100 ease-out"
          style={{ width: '140px', height: '140px', willChange: 'transform' }}
        />
        <div className="relative z-10 rounded-full bg-red-600 p-8 shadow-2xl">
          <Mic size={64} strokeWidth={2.5} />
        </div>
      </div>

      <div className="max-w-lg text-center">
        <h2 className="text-3xl leading-tight font-bold break-keep sm:text-5xl">
          {transcript || '말씀해 주세요'}
        </h2>
      </div>

      <button
        onClick={onClose}
        className="mt-20 rounded-2xl border border-white/30 bg-white/10 px-10 py-4 transition-all hover:bg-white/20"
      >
        닫기
      </button>
    </div>
  );
};

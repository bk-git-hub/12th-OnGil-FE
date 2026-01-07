import { useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useSpeechRecognition } from './use-speech-recognition';

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
  const { transcript, start, stop } = useSpeechRecognition({
    onFinalResult,
    onClose,
  });

  useEffect(() => {
    if (isListening) {
      start();
    } else {
      stop();
    }
  }, [isListening]);

  if (!isListening) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 p-6 text-white backdrop-blur-xl">
      <div className="relative mb-12 flex items-center justify-center">
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

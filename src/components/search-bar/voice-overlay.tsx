import { Mic } from 'lucide-react';
import { useSpeechRecognition } from './use-speech-recognition';

interface VoiceOverlayProps {
  onClose: () => void;
  onFinalResult: (text: string) => void;
}

/**
 * VoiceOverlay는 부모로부터 'isVoiceActive' 상태가 true일 때만 렌더링됩니다.
 * Mount와 동시에 음성 인식이 시작되며, Unmount 시 자동으로 종료됩니다.
 */
export const VoiceOverlay = ({ onClose, onFinalResult }: VoiceOverlayProps) => {
  const { transcript } = useSpeechRecognition({
    onFinalResult,
    onClose,
  });

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/80 p-6 text-white backdrop-blur-xl">
      <div className="relative mb-12 flex items-center justify-center">
        {/* 복잡한 애니메이션 제거, 명확한 마이크 아이콘만 유지 */}
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

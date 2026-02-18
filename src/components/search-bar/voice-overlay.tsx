import Image from 'next/image';
import { useSpeechRecognition } from './use-speech-recognition';

interface VoiceOverlayProps {
  onClose: () => void;
  onFinalResult: (text: string) => void;
}

/**
 * 이 컴포넌트는 부모(SearchBar)에서 제어되어,
 * 녹음이 필요할 때만 마운트되고 인식이 끝나면 언마운트됩니다.
 */
export const VoiceOverlay = ({ onClose, onFinalResult }: VoiceOverlayProps) => {
  // 마운트와 동시에 음성 인식 프로세스가 시작됨
  const { transcript } = useSpeechRecognition({
    onFinalResult,
    onClose,
  });

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/80 p-6 text-white backdrop-blur-xl">
      <div className="relative mb-12 flex items-center justify-center">
        <div className="relative z-10 flex h-[190px] w-[190px] items-center justify-center">
          <Image
            src="/icons/Union.svg"
            alt=""
            fill
            priority
            sizes="190px"
            className="object-contain"
          />
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

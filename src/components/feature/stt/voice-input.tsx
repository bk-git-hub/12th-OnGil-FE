'use client';
import { useEffect } from 'react';
import { useSpeechToText } from './use-speech-to-text';
import { AudioVisualizer } from './audio-visualizer';
import { MicIcon } from 'lucide-react';

export const VoiceInput = () => {
  const { isListening, transcript, interimText, start, stop, stream } =
    useSpeechToText();

  useEffect(() => {
    if (!isListening && transcript.trim().length > 0) {
      console.log('추후 검색 실행');
    }
  }, [isListening, transcript]);

  return (
    <div className="flex h-125 w-80 flex-col items-center justify-center rounded-2xl border border-blue-500 bg-white p-10">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <button
          onClick={isListening ? stop : start}
          className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all duration-500 outline-none ${
            isListening ? 'bg-blue-500' : 'border border-gray-100 bg-white'
          }`}
        >
          <div
            className={`absolute transition-all duration-300 ${isListening ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}`}
          >
            <MicIcon className="h-14 w-14 text-blue-500" />
          </div>

          <div
            className={`absolute transition-all duration-300 ${isListening ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          >
            <AudioVisualizer stream={stream} isListening={isListening} />
          </div>
        </button>
      </div>

      <div className="mt-12 h-20 text-center">
        <p
          className={`mb-4 text-xl font-bold transition-colors ${isListening ? 'text-blue-500' : 'text-gray-400'}`}
        >
          {isListening ? '듣고 있어요' : '눌러서 말하기'}
        </p>
        <div className="max-w-sm text-2xl font-semibold break-keep text-gray-800">
          <span>{transcript}</span>
          <span className="text-blue-400">{interimText}</span>
        </div>
      </div>
    </div>
  );
};

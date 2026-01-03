'use client';

import { useState } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { VoiceOverlay } from './voice-overlay';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4">
      {/* 음성 입력 중에도 SearchBar(부모)는 리렌더링되지 않음.
         오직 최종 결과가 나왔을 때 setQuery가 실행되면서 딱 한 번 다시 그려짐.
      */}
      <VoiceOverlay
        isListening={isVoiceActive}
        onClose={() => setIsVoiceActive(false)}
        onFinalResult={(text) => setQuery(text)}
      />

      <form onSubmit={(e) => e.preventDefault()} className="group relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어 입력"
          className="h-16 w-full rounded-2xl border-2 border-gray-200 pr-28 pl-14 text-xl shadow-sm transition-all focus:border-blue-500 focus:outline-none"
        />
        <Search
          className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400"
          size={28}
        />

        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 text-gray-400"
            >
              <X size={24} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsVoiceActive(true)}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
          >
            <Mic size={28} />
          </button>
        </div>
      </form>
    </div>
  );
}

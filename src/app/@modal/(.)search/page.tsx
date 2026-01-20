'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchBar from '@/components/search-bar';
import Modal from '@/components/ui/search-modal';

export default function InterceptedSearchPage() {
  const router = useRouter();

  return (
    <Modal>
      <div className="flex h-full flex-col px-4 pt-4">
        <div className="mb-4 flex items-center gap-2">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="닫기"
          >
            <Image src="/icons/arrow.svg" width={24} height={24} alt="닫기" />
          </button>

          {/* 검색바 영역 */}
          <div className="flex w-full">
            <SearchBar />
          </div>
        </div>

        {/* 검색 결과 및 컨텐츠 영역 */}
        <div className="flex-1 pt-20 text-center text-gray-400">
          <p>검색 결과가 여기에 표시됩니다.</p>
        </div>
      </div>
    </Modal>
  );
}

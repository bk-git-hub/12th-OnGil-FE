'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <Image src="/icons/arrow.svg" width={37} height={37} alt="뒤로가기" />
    </button>
  );
}

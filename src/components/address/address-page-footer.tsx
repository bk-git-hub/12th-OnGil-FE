'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AddressPageFooterProps {
  isManageMode: boolean;
}

export default function AddressPageFooter({
  isManageMode,
}: AddressPageFooterProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-5">
      <div className="mx-auto w-full max-w-2xl">
        {isManageMode ? (
          <Link
            href="/address/new"
            className="bg-ongil-teal mx-auto flex h-16 items-center justify-center rounded-3xl text-xl font-bold text-white transition-opacity hover:opacity-90"
          >
            배송지 추가
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/address/new"
              className="flex h-16 items-center justify-center rounded-3xl border border-[#bdbdbd] bg-white text-xl font-bold text-[#111]"
            >
              배송지 추가
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-ongil-teal h-16 rounded-3xl text-xl font-bold text-white"
            >
              선택 완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

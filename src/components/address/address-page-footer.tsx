'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface AddressPageFooterProps {
  isManageMode: boolean;
  isSelectMode?: boolean;
  returnTo?: string;
}

export default function AddressPageFooter({
  isManageMode,
  isSelectMode = false,
  returnTo,
}: AddressPageFooterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAddressParams = new URLSearchParams(searchParams.toString());
  nextAddressParams.delete('selectedAddressId');
  const newAddressHref = nextAddressParams.toString()
    ? `/address/new?${nextAddressParams.toString()}`
    : '/address/new';

  const handleCompleteSelection = () => {
    const selectedAddressId = searchParams.get('selectedAddressId');

    if (!selectedAddressId) {
      if (!isSelectMode) {
        router.back();
        return;
      }

      alert('배송지를 선택해주세요.');
      return;
    }

    if (isSelectMode && returnTo) {
      const targetUrl = new URL(returnTo, window.location.origin);
      targetUrl.searchParams.set('selectedAddressId', selectedAddressId);

      router.replace(`${targetUrl.pathname}${targetUrl.search}`);
      return;
    }

    router.back();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white p-5">
      <div className="mx-auto w-full max-w-2xl">
        {isManageMode ? (
          <Link
            href={newAddressHref}
            className="bg-ongil-teal mx-auto flex h-16 items-center justify-center rounded-3xl text-xl font-bold text-white transition-opacity hover:opacity-90"
          >
            배송지 추가
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              href={newAddressHref}
              className="flex h-16 items-center justify-center rounded-3xl border border-[#bdbdbd] bg-white text-xl font-bold text-[#111]"
            >
              배송지 추가
            </Link>
            <button
              type="button"
              onClick={handleCompleteSelection}
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

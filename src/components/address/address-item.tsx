'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { deleteAddress } from '@/app/actions/address';
import { AddressItem as AddressItemType } from '@/types/domain/address';

interface AddressItemProps {
  item: AddressItemType;
  isSelected: boolean;
  onSelect: (addressId: number) => void;
  showSelectButton?: boolean;
}

export default function AddressItem({
  item,
  isSelected,
  onSelect,
  showSelectButton = true,
}: AddressItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const mode = searchParams.get('mode');
  const returnTo = searchParams.get('returnTo');
  const currentQuery = searchParams.toString();
  const editReturnTo =
    mode === 'select' && returnTo?.startsWith('/')
      ? returnTo
      : currentQuery
        ? `${pathname}?${currentQuery}`
        : undefined;
  const editHref = editReturnTo
    ? `/address/${item.addressId}?returnTo=${encodeURIComponent(editReturnTo)}`
    : `/address/${item.addressId}`;

  const handleDelete = async () => {
    if (!confirm('정말 이 배송지를 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deleteAddress(item.addressId);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '삭제 실패');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border bg-white p-4 transition-colors ${
        isSelected ? 'border-ongil-teal' : 'border-[#bdbdbd]'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span
          className={`inline-flex rounded-xl px-5 py-2 text-2xl ${
            item.isDefault
              ? 'bg-ongil-teal text-white'
              : 'bg-[#cfcfcf] text-[#111]'
          }`}
        >
          {item.isDefault ? '기본 배송지' : '일반 배송지'}
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label={`${item.recipientName} 배송지 삭제`}
          className="text-base text-gray-500 underline underline-offset-4 hover:text-red-500"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <div className="space-y-7 px-2 text-xl">
        <p>{item.recipientName}</p>
        <p className="break-words whitespace-pre-wrap">
          {[item.baseAddress, item.detailAddress].filter(Boolean).join(' ')}
        </p>
        <p>{item.recipientPhone}</p>
        <p className="break-words whitespace-pre-wrap">
          {item.deliveryRequest || '요청사항 없음'}
        </p>
      </div>

      <div
        className={`mt-8 grid gap-4 ${
          showSelectButton ? 'grid-cols-2' : 'grid-cols-1'
        }`}
      >
        <Link
          href={editHref}
          className="bg-ongil-teal flex h-16 items-center justify-center rounded-2xl text-xl font-semibold text-white"
        >
          수정
        </Link>

        {showSelectButton ? (
          <button
            onClick={() => onSelect(item.addressId)}
            aria-label={`${item.recipientName} 배송지 선택`}
            className={`focus-visible:border-ongil-teal focus-visible:ring-ongil-teal/30 h-16 rounded-2xl border-2 text-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none ${
              isSelected
                ? 'border-ongil-teal text-ongil-teal bg-white'
                : 'border-transparent bg-[#cfcfcf] text-[#111]'
            }`}
          >
            {isSelected ? '선택됨' : '선택'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

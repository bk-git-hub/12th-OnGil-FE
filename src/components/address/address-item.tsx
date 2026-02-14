'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteAddress, setAsDefaultAddress } from '@/app/actions/address';
import { AddressItem as AddressItemType } from '@/types/domain/address';

interface AddressItemProps {
  item: AddressItemType;
}

export default function AddressItem({ item }: AddressItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

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

  const handleSetDefault = async () => {
    if (item.isDefault) return;

    setIsSettingDefault(true);
    try {
      await setAsDefaultAddress(item.addressId);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : '설정 실패');
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#bdbdbd] bg-white p-4">
      <div className="mb-5 flex items-center justify-between">
        <span
          className={`inline-flex rounded-xl px-5 py-2 text-2xl ${
            item.isDefault
              ? 'bg-ongil-teal text-white'
              : 'bg-white text-gray-600'
          }`}
        >
          {item.isDefault ? '기본 배송지' : '일반 배송지'}
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-base text-gray-500 underline underline-offset-4 hover:text-red-500"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>

      <div className="space-y-7 px-2 text-xl">
        <p>{item.recipientName}</p>
        <p>{item.baseAddress}</p>
        <p>{item.recipientPhone}</p>
        <p className="break-words whitespace-pre-wrap">
          {item.detailAddress || ' '}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link
          href={`/address/${item.addressId}`}
          className="bg-ongil-teal flex h-16 items-center justify-center rounded-2xl text-xl font-semibold text-white"
        >
          수정
        </Link>

        <button
          onClick={handleSetDefault}
          disabled={item.isDefault || isSettingDefault}
          className={`h-16 rounded-2xl text-xl font-semibold ${
            item.isDefault
              ? 'cursor-not-allowed bg-[#cfcfcf] text-[#666]'
              : 'bg-[#cfcfcf] text-[#111]'
          }`}
        >
          {isSettingDefault ? '선택 중...' : item.isDefault ? '선택됨' : '선택'}
        </button>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-3 border-b py-5 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {item.recipientName}
            </span>
            {item.isDefault && (
              <span className="bg-ongil-teal/10 text-ongil-teal rounded-full px-2 py-0.5 text-xs font-semibold">
                기본 배송지
              </span>
            )}
          </div>
          <span className="text-gray-500">{item.recipientPhone}</span>
          <div className="mt-1 text-gray-800">
            <span>({item.postalCode}) </span>
            <span>
              {item.baseAddress} {item.detailAddress}
            </span>
          </div>
        </div>

        <Link
          href={`/address/${item.addressId}`}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
        >
          수정
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {!item.isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-800"
          >
            {isSettingDefault ? '설정 중...' : '기본 배송지로 설정'}
          </button>
        )}

        {/* 구분선 */}
        {!item.isDefault && <span className="h-3 w-px bg-gray-300"></span>}

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-red-500"
        >
          {isDeleting ? '삭제 중...' : '삭제'}
        </button>
      </div>
    </div>
  );
}

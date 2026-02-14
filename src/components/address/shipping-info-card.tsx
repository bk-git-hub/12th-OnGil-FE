'use client';

import Link from 'next/link';
import { AddressItem } from '@/types/domain/address';

interface ShippingInfoCardProps {
  address: AddressItem | null;
  title?: string;
  className?: string;
}

export default function ShippingInfoCard({
  address,
  title = '배송지 정보',
  className,
}: ShippingInfoCardProps) {
  const actionHref = address ? `/address/${address.addressId}` : '/address/new';
  const actionLabel = address ? '배송지 수정하기' : '배송지 입력하기';

  return (
    <section className={className}>
      <h2 className="mb-3 text-2xl">{title}</h2>

      <div className="rounded-xl border border-[#cfcfcf] bg-white p-4">
        {address ? (
          <div className="mb-5 flex flex-col gap-6 text-xl leading-normal text-black">
            <p>{address.recipientName}</p>
            <p>{address.baseAddress}</p>
            <p>{address.recipientPhone}</p>
            <p className="wrap-break-word line-clamp-3 whitespace-pre-wrap">
              {address.detailAddress}
            </p>
          </div>
        ) : (
          <div className="mb-5 flex min-h-[180px] items-center justify-center">
            <p className="text-2xl text-[#9a9a9a]">배송지 정보가 없습니다</p>
          </div>
        )}

        <Link
          href={actionHref}
          className="bg-ongil-teal mx-auto flex h-14 w-[260px] items-center justify-center rounded-xl px-5 text-xl font-medium text-white"
        >
          {actionLabel}
        </Link>
      </div>
    </section>
  );
}

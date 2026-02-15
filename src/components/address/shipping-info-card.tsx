import Link from 'next/link';
import { AddressItem } from '@/types/domain/address';

interface ShippingInfoCardProps {
  address: AddressItem | null;
  title?: string;
  className?: string;
  actionHref?: string;
  actionLabel?: string;
}

function splitAddressByParen(address: string) {
  const index = address.indexOf('(');
  if (index < 0) {
    return { main: address, sub: '' };
  }

  return {
    main: address.slice(0, index).trim(),
    sub: address.slice(index).trim(),
  };
}

export default function ShippingInfoCard({
  address,
  title = '배송지 정보',
  className,
  actionHref,
  actionLabel,
}: ShippingInfoCardProps) {
  const resolvedActionHref =
    actionHref ?? (address ? `/address/${address.addressId}` : '/address/new');
  const resolvedActionLabel =
    actionLabel ?? (address ? '배송지 수정하기' : '배송지 입력하기');
  const baseAddress = address?.baseAddress?.trim() || '';
  const detailAddress = address?.detailAddress?.trim() || '';
  const fullAddress = [baseAddress, detailAddress].filter(Boolean).join(' ');
  const { main: mainBaseAddress, sub: subBaseAddress } =
    splitAddressByParen(baseAddress);

  return (
    <section className={className}>
      <h2 className="my-8 text-2xl">{title}</h2>

      <div className="rounded-xl border border-[#cfcfcf] bg-white p-4">
        {address ? (
          <div className="mb-5 flex flex-col gap-6 text-xl leading-normal text-black">
            <p>{address.recipientName}</p>
            <div
              title={fullAddress}
              className="space-y-1 leading-relaxed [overflow-wrap:anywhere] whitespace-normal"
            >
              <p>{mainBaseAddress}</p>
              {subBaseAddress ? <p>{subBaseAddress}</p> : null}
              {detailAddress ? <p>{detailAddress}</p> : null}
            </div>
            <p>{address.recipientPhone}</p>
            <p className="[overflow-wrap:anywhere] whitespace-pre-wrap">
              {address.deliveryRequest || '요청사항 없음'}
            </p>
          </div>
        ) : (
          <div className="mb-5 flex min-h-[180px] items-center justify-center">
            <p className="text-2xl text-[#9a9a9a]">배송지 정보가 없습니다</p>
          </div>
        )}

        <Link
          href={resolvedActionHref}
          className="bg-ongil-teal mx-auto flex h-14 w-[260px] items-center justify-center rounded-xl px-5 text-xl font-medium text-white"
        >
          {resolvedActionLabel}
        </Link>
      </div>
    </section>
  );
}

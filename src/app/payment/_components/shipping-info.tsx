'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import ShippingInfoCard from '@/components/address/shipping-info-card';
import type { AddressItem } from '@/types/domain/address';

// 배송지 수정 페이지 구현 되면 다시 컴포넌트 UI 잡기

export interface ShippingFormState {
  recipient: string;
  recipientPhone: string;
  deliveryAddress: string;
  detailAddress: string;
  postalCode: string;
  deliveryMessage: string;
}

interface Props {
  value: ShippingFormState;
}

export default function ShippingInfoSection({ value }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const address: AddressItem | null =
    value.recipient && value.recipientPhone && value.deliveryAddress
      ? {
          addressId: 0,
          recipientName: value.recipient,
          recipientPhone: value.recipientPhone,
          baseAddress: value.deliveryAddress,
          detailAddress: value.detailAddress,
          postalCode: value.postalCode,
          isDefault: true,
          deliveryRequest: value.deliveryMessage,
        }
      : null;

  const currentSearch = searchParams.toString();
  const currentPath = currentSearch ? `${pathname}?${currentSearch}` : pathname;
  const params = new URLSearchParams({
    mode: 'select',
    returnTo: currentPath,
  });
  const selectedAddressId = searchParams.get('selectedAddressId');
  if (selectedAddressId) {
    params.set('selectedAddressId', selectedAddressId);
  }
  const addressActionHref = `/address?${params.toString()}`;

  return (
    <div className="px-5">
      <ShippingInfoCard
        address={address}
        title="배송지를 확인 해주세요"
        actionHref={addressActionHref}
        actionLabel="배송지 수정하기"
      />
    </div>
  );
}

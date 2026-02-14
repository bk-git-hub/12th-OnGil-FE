'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AddressItem as AddressItemType } from '@/types/domain/address';
import AddressItem from './address-item';

interface AddressListProps {
  addresses: AddressItemType[];
  showSelectButton?: boolean;
  initialSelectedAddressId?: number | null;
}

export default function AddressList({
  addresses,
  showSelectButton = true,
  initialSelectedAddressId,
}: AddressListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fallbackSelectedAddressId =
    addresses.find((addr) => addr.isDefault)?.addressId ?? null;
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    initialSelectedAddressId ?? fallbackSelectedAddressId,
  );

  const handleSelect = (addressId: number) => {
    setSelectedAddressId(addressId);

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('selectedAddressId', String(addressId));
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <AddressItem
          key={addr.addressId}
          item={addr}
          isSelected={selectedAddressId === addr.addressId}
          onSelect={handleSelect}
          showSelectButton={showSelectButton}
        />
      ))}
    </div>
  );
}

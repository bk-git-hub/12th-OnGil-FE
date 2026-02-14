'use client';

import { useMemo, useState } from 'react';
import { AddressItem as AddressItemType } from '@/types/domain/address';
import AddressItem from './address-item';

interface AddressListProps {
  addresses: AddressItemType[];
  showSelectButton?: boolean;
}

export default function AddressList({
  addresses,
  showSelectButton = true,
}: AddressListProps) {
  const initialSelectedAddressId = useMemo(
    () => addresses.find((addr) => addr.isDefault)?.addressId ?? null,
    [addresses],
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    initialSelectedAddressId,
  );

  return (
    <div className="flex flex-col gap-4">
      {addresses.map((addr) => (
        <AddressItem
          key={addr.addressId}
          item={addr}
          isSelected={selectedAddressId === addr.addressId}
          onSelect={setSelectedAddressId}
          showSelectButton={showSelectButton}
        />
      ))}
    </div>
  );
}

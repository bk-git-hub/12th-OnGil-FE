import { getAddresses, getMyAddress } from '@/app/actions/address';
import AddressList from '@/components/address/address-list';
import AddressPageFooter from '@/components/address/address-page-footer';
import { CloseButton } from '@/components/ui/close-button';

interface AddressListPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function AddressListPage({
  searchParams,
}: AddressListPageProps) {
  const params = await searchParams;
  const isManageMode = params.mode === 'manage';

  const [addresses, myAddress] = await Promise.all([
    getAddresses(),
    getMyAddress().catch(() => null),
  ]);

  const resolvedAddresses = addresses.map((address) => {
    if (
      address.isDefault &&
      myAddress?.hasShippingInfo &&
      myAddress.shippingDetail.addressId === address.addressId
    ) {
      return {
        ...address,
        deliveryRequest:
          myAddress.shippingDetail.deliveryRequest ||
          address.deliveryRequest ||
          '',
      };
    }
    return address;
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col bg-white leading-normal">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-gray-500 bg-white py-4">
        <h1 className="text-2xl font-bold">배송지 관리</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton href={isManageMode ? '/me/edit' : undefined} />
        </div>
      </header>

      <div className="flex-1 px-5 py-6 pb-32">
        {resolvedAddresses.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-3xl border border-[#bdbdbd] bg-white text-gray-500">
            <p className="text-2xl">등록된 배송지가 없습니다.</p>
            <p className="mt-1 text-xl">새로운 배송지를 추가해 주세요.</p>
          </div>
        ) : (
          <AddressList
            addresses={resolvedAddresses}
            showSelectButton={!isManageMode}
          />
        )}
      </div>

      <AddressPageFooter isManageMode={isManageMode} />
    </main>
  );
}

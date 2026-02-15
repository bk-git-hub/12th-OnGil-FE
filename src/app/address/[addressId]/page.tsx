import { notFound } from 'next/navigation';
import { getAddresses, getMyAddress } from '@/app/actions/address';
import AddressForm from '@/components/address/address-form';
import { CloseXButton } from '@/components/ui/close-button';

interface PageProps {
  params: Promise<{ addressId: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function AddressEditPage({
  params,
  searchParams,
}: PageProps) {
  const { addressId } = await params;
  const { returnTo } = await searchParams;
  const id = Number(addressId);
  const closeHref = returnTo?.startsWith('/') ? returnTo : '/address';

  if (Number.isNaN(id)) notFound();

  const [addresses, myAddress] = await Promise.all([
    getAddresses(),
    getMyAddress().catch(() => null),
  ]);

  const targetAddress = addresses.find((addr) => addr.addressId === id);

  if (!targetAddress) notFound();

  const resolvedAddress =
    targetAddress.isDefault &&
    myAddress?.hasShippingInfo &&
    myAddress.shippingDetail.addressId === targetAddress.addressId
      ? {
          ...targetAddress,
          deliveryRequest:
            myAddress.shippingDetail.deliveryRequest ||
            targetAddress.deliveryRequest ||
            '',
        }
      : targetAddress;

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white leading-normal">
      <header className="relative flex items-center justify-center border-b py-4">
        <h1 className="text-lg font-bold">배송지 수정</h1>
        <div className="absolute right-5">
          <CloseXButton href={closeHref} />
        </div>
      </header>

      <AddressForm initialData={resolvedAddress} />
    </main>
  );
}

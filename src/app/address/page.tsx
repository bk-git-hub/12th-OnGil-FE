import Link from 'next/link';
import { getAddresses } from '@/app/actions/address';
import AddressItem from '@/components/address/address-item';
import { CloseButton } from '@/components/ui/close-button';

export default async function AddressListPage() {
  const addresses = await getAddresses();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col bg-white leading-normal">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-gray-500 bg-white py-4">
        <h1 className="text-2xl font-bold">배송지 관리</h1>
        <div className="absolute top-1/2 left-5 -translate-y-1/2">
          <CloseButton />
        </div>
      </header>

      <div className="flex-1 px-5 py-6 pb-32">
        {addresses.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-3xl border border-[#bdbdbd] bg-white text-gray-500">
            <p className="text-2xl">등록된 배송지가 없습니다.</p>
            <p className="mt-1 text-xl">새로운 배송지를 추가해 주세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {addresses.map((addr) => (
              <AddressItem key={addr.addressId} item={addr} />
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white p-5">
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/address/new"
            className="bg-ongil-teal mx-auto flex h-16 items-center justify-center rounded-3xl text-xl font-bold text-white transition-opacity hover:opacity-90"
          >
            배송지 추가
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { getAddresses } from '@/app/actions/address';
import AddressItem from '@/components/address/address-item';
import { CloseXButton } from '@/components/ui/close-button';

export default async function AddressListPage() {
  const addresses = await getAddresses();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col bg-white leading-normal">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-center border-b bg-white py-4">
        <h1 className="text-lg font-bold">배송지 관리</h1>
        <div className="absolute right-5">
          <CloseXButton />
        </div>
      </header>

      {/* 목록 영역 */}
      <div className="flex-1 p-5 pb-24">
        {addresses.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center text-gray-500">
            <p>등록된 배송지가 없습니다.</p>
            <p className="mt-1 text-sm">새로운 배송지를 추가해 주세요.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {addresses.map((addr) => (
              <AddressItem key={addr.addressId} item={addr} />
            ))}
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 mx-auto w-full max-w-2xl bg-white p-5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <Link
          href="/address/new"
          className="bg-ongil-teal flex w-full items-center justify-center rounded-xl py-4 text-xl font-bold text-white transition-opacity hover:opacity-90"
        >
          + 새 배송지 추가
        </Link>
      </div>
    </main>
  );
}

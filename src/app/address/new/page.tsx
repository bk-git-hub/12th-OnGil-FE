import AddressForm from '@/components/address/address-form';
import { CloseXButton } from '@/components/ui/close-button';

export default function NewAddressPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white leading-normal">
      <header className="relative flex items-center justify-center border-b py-4">
        <h1 className="text-lg font-bold">배송지 추가</h1>
        <div className="absolute right-5">
          <CloseXButton />
        </div>
      </header>

      {/* 데이터 없이 호출 -> 등록 모드 */}
      <AddressForm />
    </main>
  );
}

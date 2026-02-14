import { Metadata } from 'next';
import { getOrderDetail } from '@/app/actions/order';
import { getAddresses } from '@/app/actions/address';
import { notFound } from 'next/navigation';
import { CloseXButton } from '@/components/ui/close-button';
import { CancelForm } from './_components/cancel-form';
import { auth } from '/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '주문 취소 | OnGil',
  description: '주문 취소 페이지입니다.',
};

interface CancelPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function CancelReasonPage({ params }: CancelPageProps) {
  const session = await auth();
  if (!session) redirect('/login');

  const { orderId } = await params;
  const numericId = Number(orderId);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  const [orderDetail, addresses] = await Promise.all([
    getOrderDetail(numericId),
    getAddresses(),
  ]);
  const defaultAddress = addresses.find((addr) => addr.isDefault) || null;

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-white px-5 pb-20 leading-normal">
      <header className="relative flex items-center justify-center py-8">
        <h1 className="text-3xl font-semibold">주문 취소</h1>
        <div className="absolute right-5">
          <CloseXButton />
        </div>
      </header>

      <CancelForm orderDetail={orderDetail} defaultAddress={defaultAddress} />
    </div>
  );
}

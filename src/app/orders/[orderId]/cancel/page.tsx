import { Metadata } from 'next';
import { getOrderDetail } from '@/app/actions/order';
import { notFound } from 'next/navigation';
import { CloseXButton } from '@/components/ui/close-button';
import { CancelForm } from './_components/cancel-form';

export const metadata: Metadata = {
  title: '주문 취소 | OnGil',
  description: '주문 취소 페이지입니다.',
};

interface CancelPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function CancelReasonPage({ params }: CancelPageProps) {
  const { orderId } = await params;
  const numericId = Number(orderId);
  if (Number.isNaN(numericId)) {
    notFound();
  }
  const orderDetail = await getOrderDetail(numericId);

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-white px-5 pb-20 leading-normal">
      <header className="flex items-center justify-center py-8">
        <h1 className="text-3xl font-semibold">주문 취소</h1>
        <div className="absolute right-5">
          <CloseXButton />
        </div>
      </header>

      <CancelForm orderDetail={orderDetail} />
    </div>
  );
}

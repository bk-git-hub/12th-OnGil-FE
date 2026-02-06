import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderDetail } from '@/app/actions/order';
import { CloseButton } from '@/components/ui/close-button';

export const metadata: Metadata = {
  title: '주문 상세 | OnGil',
  description: '주문 상세 정보입니다.',
};

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const order = await getOrderDetail(Number(orderId));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white">
      <header className="sticky top-0 z-20 flex h-24 w-full items-center justify-center bg-white">
        <div className="absolute top-1/2 left-4 ml-3 -translate-y-1/2">
          <CloseButton />
        </div>
        <h1 className="text-3xl leading-[18px] font-semibold">주문 상세</h1>
      </header>

      <div className="px-6 pb-32">
        {/* 주문 번호 및 날짜 */}
        <section className="border-b border-gray-200 pb-6">
          <p className="text-sm text-gray-500">주문번호</p>
          <p className="mt-1 text-lg font-semibold">{order.orderNumber}</p>
          <p className="mt-2 text-sm text-gray-500">
            {formatDate(order.createdAt)}
          </p>
        </section>

        {/* 주문 상품 목록 */}
        <section className="border-b border-gray-200 py-6">
          <h2 className="mb-4 text-xl font-semibold">주문 상품</h2>
          <ul className="space-y-4">
            {order.orderItems.map((item, index) => (
              <li key={index} className="flex gap-4">
                <Link href={`/product/${item.productId}`}>
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm text-gray-500">{item.brandName}</p>
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-medium hover:underline"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.selectedColor} / {item.selectedSize} / {item.quantity}
                    개
                  </p>
                  <p className="mt-1 font-semibold">
                    {formatPrice(item.priceAtOrder * item.quantity)}원
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 배송 정보 */}
        <section className="border-b border-gray-200 py-6">
          <h2 className="mb-4 text-xl font-semibold">배송 정보</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex">
              <dt className="w-24 text-gray-500">받는 분</dt>
              <dd>{order.recipient}</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-500">연락처</dt>
              <dd>{order.recipientPhone}</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-500">배송지</dt>
              <dd>{order.deliveryAddress}</dd>
            </div>
            {order.deliveryMessage && (
              <div className="flex">
                <dt className="w-24 text-gray-500">배송 메모</dt>
                <dd>{order.deliveryMessage}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 결제 금액 */}
        <section className="py-6">
          <h2 className="mb-4 text-xl font-semibold">결제 금액</h2>
          <div className="flex items-center justify-between text-2xl font-bold">
            <span>총 결제금액</span>
            <span className="text-blue-600">
              {formatPrice(order.totalAmount)}원
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

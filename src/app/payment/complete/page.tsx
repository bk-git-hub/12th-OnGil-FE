import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOrderDetail } from '@/app/actions/order';
import Image from 'next/image';
import { auth } from '/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '주문 완료 - 온길',
};

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderCompletePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect('/login');
  const { orderId } = await searchParams;
  if (!orderId || isNaN(Number(orderId))) {
    notFound();
  }
  const order = await getOrderDetail(Number(orderId));
  const deliveryAddress = order.deliveryAddress ?? '';
  const bracketIndex = deliveryAddress.indexOf('(');
  const deliveryAddressMain =
    bracketIndex >= 0
      ? deliveryAddress.slice(0, bracketIndex).trim()
      : deliveryAddress;
  const deliveryAddressSub =
    bracketIndex >= 0 ? deliveryAddress.slice(bracketIndex).trim() : '';

  return (
    <main className="flex min-h-screen flex-col gap-12 bg-white pb-40">
      <div className="mt-[152px] flex w-full flex-col justify-center gap-6 px-5 text-center">
        <Image
          src="/icons/bag-check.svg"
          width={64}
          height={72}
          alt="주문 완료"
          className="mx-auto"
        />
        <h1 className="">주문이 완료되었습니다</h1>
        <p className="">
          주문번호: <span className="">{order.orderNumber}</span>
        </p>

        <div className="mx-auto mt-5 grid max-w-sm grid-cols-2 gap-3 text-xl font-medium text-white">
          <Link
            href={`/orders/${order.id}`}
            className="bg-ongil-teal flex items-center justify-center rounded-md px-6 py-2"
          >
            <span>주문 상세보기</span>
          </Link>
          <Link
            href="/"
            className="bg-ongil-teal flex items-center justify-center rounded-md px-6 py-2"
          >
            <span>홈화면으로</span>
          </Link>
        </div>
      </div>

      <div className="space-y-4 px-5">
        {/* 상품 정보 카드 */}
        <div className="rounded-xl bg-white">
          <h3 className="mb-3 pb-3 text-lg font-bold">주문 상품 내역 </h3>
          <ul className="flex flex-col gap-8">
            {order.orderItems.map((item, idx) => (
              <li key={idx} className="flex gap-4">
                <div className="flex h-full w-full items-center gap-4 rounded-2xl border border-black p-5">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      width={110}
                      height={110}
                    />
                  ) : (
                    <div className="flex h-[110px] w-[110px] items-center justify-center text-xl">
                      No Image
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-center gap-7 text-xl leading-[18px] font-medium">
                    <span>{item.brandName}</span>
                    <p>{item.productName}</p>
                    <span>
                      {item.selectedColor} / {item.selectedSize}
                    </span>
                    <span>{item.quantity}개</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between pt-3 text-lg font-bold">
            <span>총 결제금액</span>
            <span className="text-xl text-blue-600">
              {(order.totalAmount ?? 0).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 배송 정보 카드 */}

        <div className="mt-12 flex flex-col gap-5 bg-white text-2xl leading-normal font-medium">
          <span className="leading-8 font-bold tracking-[0.07px]">
            배송 정보
          </span>
          <div className="flex flex-col gap-8 rounded-2xl border border-black p-4">
            <div className="flex justify-between">
              <span>받는 분</span>
              <span>{order.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span>연락처</span>
              <span>{order.recipientPhone}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-16 shrink-0 whitespace-nowrap">주소</span>
              <div className="min-w-0 flex-1 space-y-1 text-right text-xl [overflow-wrap:anywhere] whitespace-normal">
                <p>{deliveryAddressMain}</p>
                {deliveryAddressSub ? <p>{deliveryAddressSub}</p> : null}
              </div>
            </div>
            <div className="flex justify-between">
              <span>요청사항</span>
              <span>{order.deliveryMessage}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

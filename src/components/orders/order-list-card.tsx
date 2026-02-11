'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderSummary } from '@/types/domain/order';

interface OrderListCardProps {
  order: OrderSummary;
}

export function OrderListCard({ order }: OrderListCardProps) {
  const router = useRouter();
  const repItem = order.items[0];

  return (
    <Card className="rounded-lg border-black p-5">
      <CardContent className="p-0">
        {/* 상단: 날짜, 상태, ID 배지 */}
        <div className="mb-3 flex">
          <div className="flex flex-col items-start gap-[14px]">
            <span className="rounded bg-[#999999] px-4 py-0.5 text-base leading-normal font-medium text-white">
              {order.orderDate.split('T')[0]}
            </span>
            {/* 상태(주문 완료/취소 인지) */}
            <span className="text-xl leading-normal font-bold text-[#FF0000]">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="mb-4 flex gap-4">
          <Image
            src={repItem?.productImage || '/placeholder.png'}
            alt={repItem?.productName || '상품 이미지'}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-6 text-xl leading-[18px] font-medium">
            <span>{repItem?.productName}</span>
            <span>
              {repItem?.selectedColor} / {repItem?.selectedSize}
            </span>
            <span>{repItem?.quantity}개</span>
            <div className="text-right">
              <span>{order.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 문의하기 링크 */}
        <div className="my-8 flex justify-end">
          <button className="flex items-center leading-[18px] font-medium text-[#999999] transition-colors">
            상품 문의하기 &gt;
          </button>
        </div>

        {/* 하단 버튼 그룹 */}
        <div className="grid h-[46px] grid-cols-2 gap-[14px] text-xl leading-normal font-medium -tracking-[0.6px]">
          <Button
            variant="outline"
            className="h-full rounded-md bg-[#C1C1C1] text-xl"
            onClick={() => router.push(`/orders/${order.orderId}/cancel`)}
          >
            <span>상품 취소하기</span>
          </Button>
          <Button
            className="bg-ongil-teal h-full rounded-md text-xl text-white"
            onClick={() => router.push(`/orders/${order.orderId}`)}
          >
            <span>주문 상세 보기</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderSummary } from '@/types/domain/order';
import { OrderStatus } from '@/types/enums';

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.ORDER_RECEIVED]: '주문 완료',
  [OrderStatus.ORDER_CONFIRMED]: '주문 확정',
  [OrderStatus.CANCELED]: '주문 취소',
};

interface OrderListCardProps {
  order: OrderSummary;
  hideActions?: boolean;
}

export default function OrderListCard({
  order,
  hideActions = false,
}: OrderListCardProps) {
  const router = useRouter();
  const repItem = order.items[0];
  const [showAlert, setShowAlert] = useState(false);
  const canCancel = order.orderStatus === OrderStatus.ORDER_RECEIVED;

  const handleCancelClick = () => {
    if (!canCancel) {
      setShowAlert(true);
    } else {
      router.push(`/orders/${order.orderId}/cancel`);
    }
  };

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
              {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
            </span>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="mb-4 flex items-start gap-4">
          <Image
            src={repItem?.productImage || '/placeholder.png'}
            alt={repItem?.productName || '상품 이미지'}
            width={110}
            height={110}
            className="h-30 w-30 shrink-0 rounded-md object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-4 text-xl leading-[18px] font-medium">
            <span>{repItem?.brandName}</span>
            <span className="line-clamp-2">{repItem?.productName}</span>
            <span>
              {repItem?.selectedColor} / {repItem?.selectedSize}
            </span>
            <span>{repItem?.quantity}개</span>
            <div className="mt-auto text-right">
              <span>{order.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {hideActions ? null : (
          <>
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
                onClick={handleCancelClick}
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
          </>
        )}
      </CardContent>

      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 w-full max-w-md rounded-2xl bg-white p-6">
            <p className="mb-6 text-center text-xl font-bold">
              {order.orderStatus === OrderStatus.CANCELED
                ? '이미 취소된 주문입니다.'
                : '주문 확정 상태에서는 취소할 수 없습니다.'}
            </p>
            <button
              className="bg-ongil-teal w-full rounded-xl py-3 text-lg text-white"
              onClick={() => setShowAlert(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

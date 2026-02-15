import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderDetail } from '@/app/actions/order';
import { CloseXButton } from '@/components/ui/close-button';
import DeleteOrderButton from '@/components/orders/delete-order-button';
import { notFound, redirect } from 'next/navigation';
import { changeOrderShippingAddress } from '@/app/actions/address';

export const metadata: Metadata = {
  title: '주문 상세 | OnGil',
  description: '주문 상세 정보입니다.',
};

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{
    selectedAddressId?: string | string[];
    addressUpdateError?: string | string[];
  }>;
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderPageProps) {
  const { orderId } = await params;
  const query = await searchParams;
  const numericId = Number(orderId);
  if (Number.isNaN(numericId)) {
    notFound();
  }

  const selectedAddressIdParam = Array.isArray(query.selectedAddressId)
    ? query.selectedAddressId[0]
    : query.selectedAddressId;
  const selectedAddressId = selectedAddressIdParam
    ? Number(selectedAddressIdParam)
    : null;
  const addressUpdateErrorParam = Array.isArray(query.addressUpdateError)
    ? query.addressUpdateError[0]
    : query.addressUpdateError;
  const showAddressUpdateError = addressUpdateErrorParam === '1';

  if (
    selectedAddressId &&
    Number.isInteger(selectedAddressId) &&
    selectedAddressId > 0
  ) {
    let addressChanged = false;
    try {
      await changeOrderShippingAddress(numericId, selectedAddressId);
      addressChanged = true;
    } catch (error) {
      console.error('주문 배송지 변경 실패:', error);
      redirect(`/orders/${numericId}?addressUpdateError=1`);
    }
    if (addressChanged) {
      redirect(`/orders/${numericId}`);
    }
  }

  const order = await getOrderDetail(numericId);

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
  const itemsTotal = order.orderItems.reduce(
    (sum, item) => sum + item.priceAtOrder * item.quantity,
    0,
  );
  const discountAmount = itemsTotal - order.totalAmount;
  const deliveryAddress = order.deliveryAddress ?? '';
  const bracketIndex = deliveryAddress.indexOf('(');
  const deliveryAddressMain =
    bracketIndex >= 0
      ? deliveryAddress.slice(0, bracketIndex).trim()
      : deliveryAddress;
  const deliveryAddressSub =
    bracketIndex >= 0 ? deliveryAddress.slice(bracketIndex).trim() : '';

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-white px-5 pb-20 leading-normal">
      <header className="flex items-center justify-center py-8">
        <h1 className="text-3xl font-semibold">주문 상세</h1>
        <div className="absolute right-5">
          <CloseXButton href="/orders" replace={true} />
        </div>
      </header>
      {showAddressUpdateError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          배송지 변경에 실패했습니다. 잠시 후 다시 시도해주세요.
        </div>
      ) : null}

      {/* 주문 번호 및 날짜 */}
      <section className="mb-8">
        <p className="text-base text-gray-500">주문번호</p>
        <p className="mt-1 text-xl font-semibold">{order.orderNumber}</p>
        <p className="mt-2 text-base text-gray-500">
          {formatDate(order.createdAt)}
        </p>
      </section>

      {/* 주문 상품 목록 */}
      <h2 className="mb-5 text-2xl">주문 상품</h2>
      <div className="mb-8 flex flex-col gap-4">
        {order.orderItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-xl border-2 border-gray-300 p-4"
          >
            <Link href={`/product/${item.productId}`} className="shrink-0">
              <Image
                src={item.imageUrl}
                alt={item.productName}
                width={80}
                height={80}
                className="h-full w-24 rounded-md object-cover"
              />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="text-lg font-medium">{item.brandName}</span>
              <Link
                href={`/product/${item.productId}`}
                className="line-clamp-2 text-lg hover:underline"
              >
                {item.productName}
              </Link>
              <span className="text-base text-gray-600">
                {item.selectedColor} / {item.selectedSize} · {item.quantity}개
              </span>
              <span className="text-lg font-bold">
                {formatPrice(item.priceAtOrder * item.quantity)}원
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 배송 정보 */}
      <h2 className="mb-5 text-2xl">배송 정보</h2>
      <div className="mb-8 rounded-xl border-2 border-gray-300 p-5 text-lg">
        <div className="flex py-2">
          <span className="w-28 text-gray-500">받는 분</span>
          <span>{order.recipient}</span>
        </div>
        <div className="flex py-2">
          <span className="w-28 text-gray-500">연락처</span>
          <span>{order.recipientPhone}</span>
        </div>
        <div className="flex py-2">
          <span className="w-28 text-gray-500">배송지</span>
          <div className="space-y-1 [overflow-wrap:anywhere] whitespace-normal">
            <p>{deliveryAddressMain}</p>
            {deliveryAddressSub ? <p>{deliveryAddressSub}</p> : null}
          </div>
        </div>
        {order.deliveryMessage && (
          <div className="flex py-2">
            <span className="w-28 text-gray-500">배송 메모</span>
            <span>{order.deliveryMessage}</span>
          </div>
        )}
      </div>

      {/* 결제 금액 */}
      <h2 className="mb-5 text-2xl">결제 금액</h2>
      <div className="rounded-xl border-2 border-gray-300 p-5 text-lg">
        <div className="flex justify-between py-2">
          <span>상품 금액</span>
          <span>{formatPrice(itemsTotal)}원</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between py-2">
            <span>할인 금액</span>
            <span className="text-red-500">
              -{formatPrice(discountAmount)}원
            </span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t pt-4 text-xl font-bold">
          <span>총 결제금액</span>
          <span>{formatPrice(order.totalAmount)}원</span>
        </div>
      </div>

      {/* 주문 기록 삭제 */}
      <DeleteOrderButton orderId={numericId} />
    </main>
  );
}

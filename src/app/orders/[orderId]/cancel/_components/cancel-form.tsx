'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cancelOrder, getRefundInfo } from '@/app/actions/order';
import { getAddresses } from '@/app/actions/address';
import {
  OrderDetail,
  OrderCancelResponse,
  OrderRefundInfoResponse,
  OrderSummary,
} from '@/types/domain/order';
import { AddressItem } from '@/types/domain/address';
import OrderListCard from '@/components/orders/order-list-card';
import ShippingInfoCard from '@/components/address/shipping-info-card';
import Image from 'next/image';

const CANCEL_REASONS = [
  {
    id: 'BUYER_RESPONSIBILITY',
    title: '구매자 책임',
    description: '색상, 사이즈 등 잘못 골랐어요\n생각했던 거랑 달라요',
  },
  {
    id: 'SELLER_RESPONSIBILITY',
    title: '판매자 책임',
    description: '배송이 늦게 와요\n다른 상품이 왔어요\n상품에 문제가 있어요',
  },
  {
    id: 'WRONG_ADDRESS',
    title: '배송지 잘못 입력',
    description: '배송지를 바꾸고 싶어요',
  },
];

type Step = 'reason' | 'address' | 'confirm' | 'complete';

interface CancelFormProps {
  orderDetail: OrderDetail;
  defaultAddress: AddressItem | null;
}

function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    const firstBtn = el.querySelector<HTMLElement>('button:not([disabled])');
    firstBtn?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = el.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      prev?.focus();
    };
  }, [active]);

  return ref;
}

export function CancelForm({ orderDetail, defaultAddress }: CancelFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = orderDetail.id;
  const selectedAddressIdParam = searchParams.get('selectedAddressId');
  const selectedAddressId = selectedAddressIdParam
    ? Number(selectedAddressIdParam)
    : null;
  const hasSelectedAddressId =
    selectedAddressId !== null &&
    Number.isInteger(selectedAddressId) &&
    selectedAddressId > 0;
  const returnToOrderDetail = `/orders/${orderId}`;
  const encodedReturnTo = encodeURIComponent(returnToOrderDetail);
  const addressListHref = `/address?mode=select&returnTo=${encodedReturnTo}`;
  const orderDetailHref = hasSelectedAddressId
    ? `/orders/${orderId}?selectedAddressId=${selectedAddressId}`
    : `/orders/${orderId}`;

  const [step, setStep] = useState<Step>(
    searchParams.get('step') === 'address' ? 'address' : 'reason',
  );
  const [selectedReason, setSelectedReason] = useState<string | null>(
    searchParams.get('step') === 'address' ? 'WRONG_ADDRESS' : null,
  );
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    retryable: boolean;
  } | null>(null);
  const [cancelResult, setCancelResult] = useState<OrderCancelResponse | null>(
    null,
  );
  const [refundInfo, setRefundInfo] = useState<OrderRefundInfoResponse | null>(
    null,
  );
  const [refundLoading, setRefundLoading] = useState(false);
  const [currentDefaultAddress, setCurrentDefaultAddress] =
    useState<AddressItem | null>(defaultAddress);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressReloadTick, setAddressReloadTick] = useState(0);
  const [addressFetchError, setAddressFetchError] = useState<string | null>(
    null,
  );

  const alertRef = useFocusTrap(!!alertMessage);
  const confirmRef = useFocusTrap(showModal);

  useEffect(() => {
    if (step !== 'confirm') return;
    setRefundLoading(true);
    getRefundInfo(orderId)
      .then((data) => {
        setRefundInfo(data);
      })
      .catch((err) => {
        console.error(err);
        setAlertMessage({
          message:
            err instanceof Error
              ? err.message
              : '환불 정보를 불러오지 못했습니다.',
          retryable: true,
        });
        setStep('reason');
      })
      .finally(() => setRefundLoading(false));
  }, [step, orderId]);

  useEffect(() => {
    if (step !== 'address') return;

    let isMounted = true;
    setAddressLoading(true);
    setAddressFetchError(null);

    getAddresses()
      .then((addresses) => {
        if (!isMounted) return;
        const selectedAddress = hasSelectedAddressId
          ? addresses.find((addr) => addr.addressId === selectedAddressId) ||
            null
          : null;
        const latestDefaultAddress =
          selectedAddress || addresses.find((addr) => addr.isDefault) || null;
        setCurrentDefaultAddress(latestDefaultAddress);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error(error);
        setCurrentDefaultAddress(null);
        setAddressFetchError(
          error instanceof Error
            ? error.message
            : '배송지 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        );
      })
      .finally(() => {
        if (!isMounted) return;
        setAddressLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [step, addressReloadTick, hasSelectedAddressId, selectedAddressId]);

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitting(true);
    try {
      const result = await cancelOrder(orderId, {
        cancelReason: selectedReason,
        cancelDetail: detail || undefined,
        addToCart,
      });
      setCancelResult(result);
      setShowModal(false);
      setStep('complete');
    } catch (error) {
      setShowModal(false);
      setAlertMessage({
        message:
          error instanceof Error ? error.message : '주문 취소에 실패했습니다.',
        retryable: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --- 알림 모달 ---
  if (alertMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          ref={alertRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-title"
          className="mx-5 w-full max-w-md rounded-2xl bg-white p-6"
        >
          <p id="alert-title" className="mb-6 text-center text-xl font-bold">
            {alertMessage.message}
          </p>
          {alertMessage.retryable ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                className="rounded-xl bg-[#D9D9D9] py-3 text-lg"
                onClick={() => router.replace('/orders')}
              >
                돌아가기
              </button>
              <button
                className="bg-ongil-teal rounded-xl py-3 text-lg text-white"
                onClick={() => setAlertMessage(null)}
              >
                다시 시도
              </button>
            </div>
          ) : (
            <button
              className="bg-ongil-teal w-full rounded-xl py-3 text-lg text-white"
              onClick={() => router.replace('/orders')}
            >
              주문 내역으로 돌아가기
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- 완료 단계 ---
  if (step === 'complete' && cancelResult) {
    const orderSummary: OrderSummary = {
      orderId: cancelResult.orderId,
      orderNumber: cancelResult.orderNumber,
      orderStatus: cancelResult.orderStatus,
      totalAmount: cancelResult.totalAmount,
      orderDate: cancelResult.createdAt,
      items: cancelResult.orderItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.imageUrl,
        brandName: item.brandName,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        price: item.priceAtOrder,
      })),
    };

    return (
      <>
        <p className="mb-8 text-center text-xl">주문이 취소되었습니다.</p>

        <OrderListCard order={orderSummary} hideActions />

        <button
          className="bg-ongil-teal sticky bottom-20 mt-8 w-full rounded-xl py-4 text-2xl text-white"
          onClick={() => window.location.replace('/orders')}
        >
          주문 내역으로
        </button>
      </>
    );
  }

  // --- 확인 단계 (상품 카드 + 환불 금액 + 버튼) ---
  if (step === 'confirm') {
    if (refundLoading || !refundInfo) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-lg text-gray-500">
            환불 정보 불러오는 중...
          </span>
        </div>
      );
    }

    const { refundInfo: refund, orderItems: refundItems } = refundInfo;

    return (
      <>
        {/* 취소 상품 */}
        <h2 className="mb-5 text-2xl">취소 상품</h2>
        <div className="mb-8 flex flex-col gap-4">
          {refundItems.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 rounded-xl border-2 border-gray-300 p-4"
            >
              <Image
                src={item.imageUrl || '/placeholder.png'}
                alt={item.productName}
                width={80}
                height={80}
              />
              <div className="flex flex-col gap-2">
                <span className="text-lg font-medium">{item.brandName}</span>
                <span className="text-lg">{item.productName}</span>
                <span className="text-base text-gray-600">
                  {item.selectedColor} / {item.selectedSize} · {item.quantity}개
                </span>
                <span className="text-lg font-bold">
                  {item.priceAtOrder.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 환불 금액 */}
        <h2 className="mb-5 text-2xl">환불 금액</h2>
        <div className="mb-8 rounded-xl border-2 border-gray-300 p-5 text-lg">
          <div className="flex justify-between py-2">
            <span>상품 금액</span>
            <span>{refund.productAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-2">
            <span>배송비</span>
            <span>{refund.shippingFee.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between py-2">
            <span>사용 포인트</span>
            <span>{refund.usedPoints.toLocaleString()}원</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-4 text-xl font-bold">
            <span>환불 예정 금액</span>
            <span>{refund.refundAmount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className="rounded-xl bg-[#D9D9D9] py-4 text-2xl"
            onClick={() =>
              setStep(selectedReason === 'WRONG_ADDRESS' ? 'address' : 'reason')
            }
          >
            이전 단계
          </button>
          <button
            className="bg-ongil-teal rounded-xl py-4 text-2xl text-white"
            onClick={() => setShowModal(true)}
          >
            주문 취소
          </button>
        </div>

        {/* 취소 확인 모달 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              ref={confirmRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="mx-5 w-full max-w-md rounded-2xl bg-white p-6"
            >
              <p
                id="confirm-title"
                className="mb-6 text-center text-xl font-bold"
              >
                주문을 취소하시겠습니까?
              </p>
              <label className="mb-6 flex cursor-pointer items-center justify-center gap-3">
                <input
                  type="checkbox"
                  checked={addToCart}
                  onChange={(e) => setAddToCart(e.target.checked)}
                  className="h-5 w-5"
                />
                <span className="text-lg">취소 상품 장바구니 담기</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="rounded-xl bg-[#D9D9D9] py-3 text-lg"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  아니요
                </button>
                <button
                  className="bg-ongil-teal rounded-xl py-3 text-lg text-white"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? '처리 중...' : '네'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (step === 'address') {
    const canProceed =
      !!currentDefaultAddress && !addressLoading && !addressFetchError;

    return (
      <div className="flex h-full flex-col justify-between bg-white">
        <div className="flex-1 pb-10">
          <ShippingInfoCard
            address={currentDefaultAddress}
            actionHref={addressListHref}
          />
          <p
            className="mt-4 px-1 text-center text-sm text-gray-600"
            aria-live="polite"
          >
            {addressLoading
              ? '최신 배송지 정보를 불러오는 중입니다.'
              : addressFetchError
                ? addressFetchError
                : canProceed
                  ? '배송지를 수정한 뒤 주문 취소를 계속하려면 다음 단계를 눌러주세요.'
                  : '배송지 정보가 없어 다음 단계로 진행할 수 없습니다. 배송지를 먼저 입력해주세요.'}
          </p>
          {addressFetchError ? (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setAddressReloadTick((prev) => prev + 1)}
                className="text-ongil-teal text-sm underline underline-offset-4"
              >
                다시 불러오기
              </button>
            </div>
          ) : null}
        </div>

        <div className="border-ongil-teal grid w-full grid-cols-2 gap-4 border-t bg-white p-6">
          <button
            className="h-14 w-full rounded-xl bg-[#D9D9D9] text-lg font-bold"
            onClick={() => setStep('reason')}
          >
            이전 단계
          </button>
          <button
            className={`h-14 w-full rounded-xl text-lg font-bold text-white ${
              canProceed ? 'bg-ongil-teal' : 'cursor-not-allowed bg-gray-300'
            }`}
            onClick={() => router.push(orderDetailHref)}
            disabled={!canProceed}
          >
            주문 상세로
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="mb-8 text-center text-xl">취소 사유를 선택 해주세요</p>
      <h2 className="mb-5 text-2xl">주문 취소</h2>

      <div className="mb-8 flex flex-col gap-4">
        {CANCEL_REASONS.map((reason) => (
          <button
            key={reason.id}
            onClick={() => handleReasonSelect(reason.id)}
            className={`rounded-xl border-2 p-5 text-left transition-all duration-200 outline-none ${
              selectedReason === reason.id
                ? 'border-ongil-teal bg-white'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="mb-2.5 text-xl font-bold">{reason.title}</div>
            <div className="text-lg whitespace-pre-line text-[#000000B2]">
              {reason.description}
            </div>
          </button>
        ))}
      </div>

      {/* 상세사유 입력 섹션 */}
      <h3 className="mb-4 text-lg font-bold">상세사유 (선택)</h3>
      <textarea
        placeholder="상세 사유를 입력해주세요 (선택)"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="font-inherit mb-8 min-h-[120px] w-full resize-y rounded-xl border-2 border-gray-300 p-4 text-sm transition-colors outline-none focus:border-gray-400"
      />

      <button
        className={`sticky bottom-20 w-full rounded-xl py-4 text-2xl text-white ${
          selectedReason ? 'bg-ongil-teal' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={!selectedReason}
        onClick={() =>
          setStep(selectedReason === 'WRONG_ADDRESS' ? 'address' : 'confirm')
        }
      >
        {selectedReason === 'WRONG_ADDRESS' ? '배송지 수정' : '주문 취소'}
      </button>
    </>
  );
}

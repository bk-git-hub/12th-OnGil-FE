'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { UserInfoResDto } from '@/types/domain/user';
import {
  createOrderFromCart,
  createOrderFromProduct,
} from '@/app/actions/order';
import type { PaymentDisplayItem } from './order-items';
import StepNavigator from './step-navigator';
import ShippingInfoSection, { type ShippingFormState } from './shipping-info';
import PaymentInfoSection from './payment-info';
import usePaymentScrollSpy from './use-payment-scroll-spy';
import { SECTIONS } from './constants';

const SECTION_IDS = Object.values(SECTIONS);

interface PaymentContextValue {
  activeId: string;
  scrollToId: (id: string) => void;
  shippingInfo: ShippingFormState;
  setShippingInfo: (v: ShippingFormState) => void;
  usedPoints: number;
  setUsedPoints: (v: number) => void;
  userPoints: number;
  totalItemPrice: number;
  finalPrice: number;
  isSubmitting: boolean;
  handlePayment: () => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

/**
 * 결제 Context를 사용하기 위한 훅
 */
function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
}

interface ProviderProps {
  user: UserInfoResDto;
  items: PaymentDisplayItem[];
  orderType: 'cart' | 'direct';
  children: ReactNode;
}

/**
 * 결제 페이지의 전역 상태 관리 Provider
 * - 배송지 정보, 포인트, 결제 처리
 */
export function PaymentProvider({
  user,
  items,
  orderType,
  children,
}: ProviderProps) {
  const router = useRouter();
  const { activeId, scrollToId } = usePaymentScrollSpy(SECTION_IDS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingFormState>({
    recipient: user.name,
    recipientPhone: user.phone || '',
    deliveryAddress: '',
    detailAddress: '',
    postalCode: '',
    deliveryMessage: '',
  });

  const [usedPoints, setUsedPoints] = useState(0);

  const totalItemPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const finalPrice = Math.max(0, totalItemPrice - usedPoints);

  /**
   * 결제 처리 함수
   * - 배송지 정보 유효성 검증 후 주문 생성
   */
  const handlePayment = async () => {
    if (isSubmitting) return;
    if (
      !shippingInfo.recipient.trim() ||
      !shippingInfo.recipientPhone.trim() ||
      !shippingInfo.deliveryAddress ||
      !shippingInfo.postalCode
    ) {
      alert('배송지 정보를 모두 입력해주세요.');
      scrollToId(SECTIONS.SHIPPING);
      return;
    }

    try {
      setIsSubmitting(true);
      let orderId: number;

      if (orderType === 'cart') {
        orderId = await createOrderFromCart({
          cartItemIds: items
            .map((item) => item.cartItemId)
            .filter((id): id is number => id != null),
          usedPoints,
          ...shippingInfo,
        });
      } else {
        orderId = await createOrderFromProduct({
          items: items.map((item) => ({
            productId: item.productId,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            quantity: item.quantity,
          })),
          usedPoints,
          ...shippingInfo,
        });
      }

      router.replace(`/payment/complete?orderId=${orderId}`);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : '주문에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        activeId,
        scrollToId,
        shippingInfo,
        setShippingInfo,
        usedPoints,
        setUsedPoints,
        userPoints: user.points,
        totalItemPrice,
        finalPrice,
        isSubmitting,
        handlePayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

/**
 * Context와 연결된 단계별 네비게이터
 */
export function ConnectedStepNavigator() {
  const { activeId, scrollToId } = usePayment();
  return <StepNavigator activeStep={activeId} onStepChange={scrollToId} />;
}

/**
 * Context와 연결된 배송지 정보 섹션
 */
export function ConnectedShippingSection() {
  const { shippingInfo, setShippingInfo } = usePayment();
  return (
    <ShippingInfoSection value={shippingInfo} onChange={setShippingInfo} />
  );
}

/**
 * Context와 연결된 결제 정보 섹션
 */
export function ConnectedPaymentSection() {
  const { userPoints, totalItemPrice, usedPoints, setUsedPoints } =
    usePayment();
  return (
    <PaymentInfoSection
      userPoints={userPoints}
      totalPrice={totalItemPrice}
      usedPoints={usedPoints}
      onPointsChange={setUsedPoints}
    />
  );
}

/**
 * 결제하기 버튼 (하단 고정)
 */
export function PaymentButton() {
  const { finalPrice, isSubmitting, handlePayment } = usePayment();
  return (
    <div className="safe-area-bottom fixed right-0 bottom-0 left-0 z-50 bg-white p-4">
      <div className="mx-auto max-w-xl">
        <button
          onClick={handlePayment}
          disabled={isSubmitting}
          className="bg-ongil-teal flex w-full justify-between rounded-xl px-6 py-4 text-3xl font-normal text-white"
        >
          <span>{finalPrice.toLocaleString()}원</span>
          <span>{isSubmitting ? '처리중...' : '결제하기'}</span>
        </button>
      </div>
    </div>
  );
}

import { auth } from '/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  fetchCartOrderItems,
  fetchDirectOrderItems,
} from '@/app/actions/order';
import { getAddresses, getMyAddress } from '@/app/actions/address';
import { getUserInfo } from '@/app/actions/user';
import OrderItemsSection from './_components/order-items';
import { SECTIONS } from './_components/constants';
import {
  PaymentProvider,
  ConnectedStepNavigator,
  ConnectedShippingSection,
  ConnectedPaymentSection,
  PaymentButton,
} from './_components/payment-context';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '주문/결제 - 온길',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session) redirect('/login');

  const params = await searchParams;
  const isCartOrder = params.cart === 'true';
  const selectedAddressIdParam = Array.isArray(params.selectedAddressId)
    ? params.selectedAddressId[0]
    : params.selectedAddressId;
  const selectedAddressId = selectedAddressIdParam
    ? Number(selectedAddressIdParam)
    : null;

  const [user, items, addresses, myAddress] = await Promise.all([
    getUserInfo(),
    isCartOrder ? fetchCartOrderItems(params) : fetchDirectOrderItems(params),
    getAddresses().catch(() => []),
    getMyAddress().catch(() => null),
  ]);

  const selectedAddress =
    selectedAddressId && !Number.isNaN(selectedAddressId)
      ? addresses.find((item) => item.addressId === selectedAddressId) || null
      : null;
  const defaultAddress =
    selectedAddress || addresses.find((item) => item.isDefault) || null;
  const resolvedDefaultAddress =
    defaultAddress &&
    myAddress?.hasShippingInfo &&
    myAddress.shippingDetail.addressId === defaultAddress.addressId
      ? {
          ...defaultAddress,
          deliveryRequest:
            myAddress.shippingDetail.deliveryRequest ||
            defaultAddress.deliveryRequest,
        }
      : defaultAddress;

  return (
    <main className="min-h-screen">
      <PaymentProvider
        user={user}
        items={items}
        orderType={isCartOrder ? 'cart' : 'direct'}
        defaultAddress={resolvedDefaultAddress}
      >
        <ConnectedStepNavigator />

        <div className="mx-auto mt-4 max-w-xl space-y-8 pb-32">
          <section id={SECTIONS.ITEMS} className="scroll-mt-[120px]">
            <OrderItemsSection items={items} />
          </section>

          <section id={SECTIONS.SHIPPING} className="scroll-mt-[120px]">
            <ConnectedShippingSection />
          </section>

          <section
            id={SECTIONS.PAYMENT}
            className="min-h-[60vh] scroll-mt-[120px]"
          >
            <ConnectedPaymentSection />
          </section>
        </div>

        <PaymentButton />
      </PaymentProvider>
    </main>
  );
}

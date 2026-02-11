import { Metadata } from 'next';
import { getCartItems } from '@/app/actions/cart';
import { CloseButton } from '@/components/ui/close-button';
import { CartProvider } from '@/components/cart/cart-context';
import {
  CartHeaderControl,
  CartItemList,
  CartSummaryFooter,
} from '@/components/cart/cart-views';
import type { CartResponse } from '@/types/domain/cart';

export const metadata: Metadata = {
  title: '장바구니 | OnGil',
  description: '장바구니 목록입니다.',
};

export default async function CartPage() {
  let cartItems: CartResponse[] = [];

  try {
    cartItems = await getCartItems();
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('Failed to fetch cart items:', error);
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl">
      <header className="sticky top-0 z-20 flex h-24 w-full items-center justify-center bg-white">
        <div className="absolute top-1/2 left-4 ml-3 -translate-y-1/2">
          <CloseButton />
        </div>
        <h1 className="text-3xl leading-[18px] font-semibold">장바구니</h1>
      </header>

      <CartProvider initialCartItems={cartItems}>
        <div className="relative pb-32 text-xl leading-[18px] font-medium">
          <CartHeaderControl />

          <CartItemList />

          <CartSummaryFooter />
        </div>
      </CartProvider>
    </main>
  );
}

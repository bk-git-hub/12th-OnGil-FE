import { getCartItems } from '@/app/actions/cart';
import { CartList } from '@/components/cart/cart-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '장바구니 | OnGil',
  description: '장바구니 목록입니다.',
};

export default async function CartPage() {
  const cartItems = await getCartItems();

  return (
    <main className="mx-auto min-h-screen max-w-2xl">
      <header className="sticky top-0 z-20 flex h-24 items-center justify-center bg-white px-4">
        <h1 className="text-3xl leading-[18px] font-semibold">장바구니</h1>
      </header>
      <CartList initialCartItems={cartItems} />
    </main>
  );
}

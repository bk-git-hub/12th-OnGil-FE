import { connection } from 'next/server';
import { getCartCount } from '@/app/actions/cart';
import { rethrowNextError } from '@/lib/server-action-utils';
import CartStoreInitializer from '@/components/cart/cart-store-initializer';

export default async function CartDataFetcher() {
  await connection();

  let cartCount = 0;
  try {
    cartCount = await getCartCount();
  } catch (error) {
    rethrowNextError(error);
    console.error('Failed to fetch cart count:', error);
  }

  return <CartStoreInitializer count={cartCount} />;
}

import { connection } from 'next/server';
import { getCartCount } from '@/app/actions/cart';
import CartStoreInitializer from '@/components/cart/cart-store-initializer';

export async function CartDataFetcher() {
  await connection();

  let cartCount = 0;
  try {
    cartCount = await getCartCount();
  } catch (error) {
    if (error instanceof Error && 'digest' in error) throw error;
    console.error('Failed to fetch cart count:', error);
  }

  return <CartStoreInitializer count={cartCount} />;
}

import { getCartCount } from '@/app/actions/cart';
import CartStoreInitializer from '@/components/cart/cart-store-initializer';

export async function CartDataFetcher() {
  let cartCount = 0;
  try {
    cartCount = await getCartCount();
  } catch (error) {
    console.error('Failed to fetch cart count:', error);
  }

  return <CartStoreInitializer count={cartCount} />;
}

import { create } from 'zustand';
import { getCartCount } from '@/app/actions/cart';

interface CartState {
  count: number;
  fetchCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  fetchCount: async () => {
    try {
      const count = await getCartCount();
      set({ count });
    } catch (error) {
      console.error('장바구니 개수 조회 실패', error);
    }
  },
}));

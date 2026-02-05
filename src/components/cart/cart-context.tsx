'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CartResponse } from '@/types/domain/cart';
import { useCartService } from './use-cart-service';

type CartContextType = ReturnType<typeof useCartService>;

const CartContext = createContext<CartContextType | null>(null);
CartContext.displayName = 'CartContext';

interface CartProviderProps {
  initialCartItems: CartResponse[];
  children: ReactNode;
}

export function CartProvider({
  initialCartItems,
  children,
}: CartProviderProps) {
  const cartService = useCartService(initialCartItems);

  return (
    <CartContext.Provider value={cartService}>{children}</CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCartContext must be used within a <CartProvider>. Wrap your component tree with CartProvider.',
    );
  }

  return context;
}

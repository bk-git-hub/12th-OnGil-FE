'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

interface CartStoreInitializerProps {
  count: number;
}

export default function CartStoreInitializer({
  count,
}: CartStoreInitializerProps) {
  useEffect(() => {
    useCartStore.setState({ count });
  }, [count]);

  return null;
}

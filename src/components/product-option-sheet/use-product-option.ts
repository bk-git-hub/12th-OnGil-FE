'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ProductOption } from '@/types/domain/product';
import { addToCart } from '@/app/actions/cart';
import { useCartStore } from '@/store/cart';

export interface SelectedItem {
  id: string;
  optionId: number;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface UseProductOptionProps {
  productId: number;
  price: number;
  options: ProductOption[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function useProductOption({
  productId,
  price,
  options: initialOptions = [],
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: UseProductOptionProps) {
  const router = useRouter();
  const { fetchCount } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalIsOpen;

  const setIsOpen = (newOpen: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalIsOpen(newOpen);
    }
  };

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentSize, setCurrentSize] = useState<string>('');

  const options = initialOptions;

  const availableColors = Array.from(
    new Set(options.map((o) => o.color).filter(Boolean)),
  );

  const availableSizes = options
    .filter((o) => !currentColor || o.color === currentColor)
    .map((o) => o.size)
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const addItemToSelection = useCallback(
    (option: ProductOption) => {
      setSelectedItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.optionId === option.optionId,
        );
        if (existingIdx > -1) {
          const newItems = [...prev];
          newItems[existingIdx] = {
            ...newItems[existingIdx],
            quantity: newItems[existingIdx].quantity + 1,
          };
          return newItems;
        }
        return [
          ...prev,
          {
            id: `${option.optionId}-${Date.now()}`,
            optionId: option.optionId,
            color: option.color,
            size: option.size,
            quantity: 1,
            price,
          },
        ];
      });
    },
    [price],
  );

  useEffect(() => {
    if (currentColor && currentSize) {
      const targetOption = options.find(
        (o) => o.color === currentColor && o.size === currentSize,
      );

      if (targetOption) {
        addItemToSelection(targetOption);
      }
      setCurrentSize('');
    }
  }, [currentColor, currentSize, options, addItemToSelection]);

  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAction = async (type: 'cart' | 'buy') => {
    if (selectedItems.length === 0) {
      alert('옵션을 선택해주세요.');
      return;
    }

    startTransition(async () => {
      try {
        if (type === 'cart') {
          await Promise.all(
            selectedItems.map((item) =>
              addToCart({
                productId,
                selectedColor: item.color,
                selectedSize: item.size,
                quantity: item.quantity,
              }),
            ),
          );

          await fetchCount();

          setIsOpen(false);
          setIsSuccessModalOpen(true);
          setSelectedItems([]);
          setCurrentColor('');
          setCurrentSize('');
        } else {
          const selections = selectedItems.map((item) => ({
            color: item.color,
            size: item.size,
            quantity: item.quantity,
          }));

          const params = new URLSearchParams({
            productId: String(productId),
            selections: JSON.stringify(selections),
          });

          setIsOpen(false);
          setSelectedItems([]);
          setCurrentColor('');
          setCurrentSize('');
          router.push(`/payment?${params.toString()}`);
        }
      } catch (error) {
        console.error(error);
        alert('처리 중 오류가 발생했습니다.');
      }
    });
  };

  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const navigateToCart = () => {
    setIsSuccessModalOpen(false);
    router.push('/cart');
  };

  return {
    state: {
      isOpen,
      isSuccessModalOpen,
      selectedItems,
      currentColor,
      currentSize,
      availableColors,
      availableSizes,
      isPending,
      totalPrice,
    },
    actions: {
      setIsOpen,
      setIsSuccessModalOpen,
      setCurrentColor,
      setCurrentSize,
      updateQuantity,
      removeItem,
      handleAction,
      navigateToCart,
    },
  };
}

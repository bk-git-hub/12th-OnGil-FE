'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ProductOption } from '@/types/domain/product';
import { addToCart } from '@/app/actions/cart';
import { useCartStore } from '@/store/cart';
import { StockStatus } from '@/types/enums';

export interface SelectedItem {
  id: string;
  optionId: number;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

const generateDummyOptions = (): ProductOption[] => {
  const colors = ['블랙', '화이트', '네이비', '차콜'];
  const sizes = ['S', 'M', 'L', 'XL'];
  return colors.flatMap((color, i) =>
    sizes.map((size, j) => ({
      optionId: 1000 + i * 10 + j,
      color,
      size,
      stock: 100,
      stockStatus: StockStatus.AVAILABLE,
    })),
  );
};

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

  const options =
    initialOptions.length > 0 ? initialOptions : generateDummyOptions();

  const availableColors = Array.from(
    new Set(options.map((o) => o.color).filter(Boolean)),
  );

  const availableSizes = options
    .filter((o) => !currentColor || o.color === currentColor)
    .map((o) => o.size)
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

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
  }, [currentColor, currentSize, options]);

  const addItemToSelection = (option: ProductOption) => {
    setSelectedItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.optionId === option.optionId,
      );
      if (existingIdx > -1) {
        const newItems = [...prev];
        newItems[existingIdx].quantity += 1;
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
  };

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

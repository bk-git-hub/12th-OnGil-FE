import { useSyncExternalStore } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export function useCarouselDots(api: CarouselApi | undefined) {
  const current = useSyncExternalStore(
    (onStoreChange) => {
      if (!api) return () => {};
      api.on('select', onStoreChange);
      api.on('reInit', onStoreChange);
      return () => {
        api.off('select', onStoreChange);
        api.off('reInit', onStoreChange);
      };
    },
    () => api?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const count = useSyncExternalStore(
    (onStoreChange) => {
      if (!api) return () => {};
      api.on('reInit', onStoreChange);
      return () => api.off('reInit', onStoreChange);
    },
    () => api?.scrollSnapList().length ?? 0,
    () => 0,
  );

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return { current, count, scrollTo };
}

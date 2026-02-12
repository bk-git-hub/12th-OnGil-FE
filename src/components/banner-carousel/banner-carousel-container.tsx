import { api } from '@/lib/api-client';
import { Advertisement } from '@/types/domain/advertisement';
import { CarouselWithDots } from './carousel-with-dots';

export default async function BannerCarouselContainer() {
  const advertisements = await api.get<Advertisement[]>('/advertisements/home');

  return <CarouselWithDots advertisements={advertisements} />;
}

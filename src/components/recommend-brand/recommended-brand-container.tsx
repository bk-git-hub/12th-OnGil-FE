import { api } from '@/lib/api-client';
import { BrandWithProducts } from '@/types/domain/brand';
import RecommendedBrandClient from './recommended-brand-client';

export default async function RecommendedBrandContainer() {
  const brands = await api.get<BrandWithProducts[]>('/brands/recommend');

  return <RecommendedBrandClient brands={brands} />;
}

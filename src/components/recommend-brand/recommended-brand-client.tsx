'use client';

import { useState } from 'react';
import { BrandWithProducts } from '@/types/domain/brand';
import RecommendedBrandHeader from './recommended-brand-header';
import RecommendedBrandGridCard from './recommended-brand-grid-card';
import { getLocaleFromDocument, t } from '@/lib/i18n';
import { ProductWithWishlist } from '@/types/domain/product';

type BrandWithWishlistProducts = Omit<BrandWithProducts, 'products'> & {
  products: ProductWithWishlist[];
};

interface RecommendedBrandClientProps {
  brands: BrandWithWishlistProducts[];
}

export default function RecommendedBrandClient({
  brands,
}: RecommendedBrandClientProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const locale = getLocaleFromDocument();

  if (brands.length === 0) return null;

  const currentBrand = brands[selectedIndex];
  const currentProducts = currentBrand?.products || [];

  return (
    <div className="flex w-full flex-col p-5">
      <RecommendedBrandHeader
        brands={brands}
        onClick={setSelectedIndex}
        selectedIndex={selectedIndex}
      />

      <div className="mt-4">
        <div className="mt-2 w-full">
          {currentProducts.length > 0 ? (
            <ul className="grid w-full grid-cols-2 justify-items-center gap-4">
              {currentProducts.map((product) => (
                <li key={product.id}>
                  <RecommendedBrandGridCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p>{t(locale, 'recommendedBrand.noProducts')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

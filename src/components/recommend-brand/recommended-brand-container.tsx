'use client';

import { Product, Brand } from '@/types/products';
import { useState } from 'react';
import RecommendedBrandHeader from './recommended-brand-header';
import RecommendedBrandGridCard from './recommended-brand-grid-card';

interface RecommendedBrandContainerProps {
  brands: Brand[];

  productLists: Product[][];
}

export default function RecommendedBrandContainer({
  brands,
  productLists,
}: RecommendedBrandContainerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const currentBrand = brands[selectedIndex];
  const currentProducts = productLists[selectedIndex] || [];

  return (
    <div className="flex w-full flex-col p-4">
      <RecommendedBrandHeader
        brands={brands}
        onClick={setSelectedIndex}
        selectedIndex={selectedIndex}
      />

      <div className="mt-4">
        <h2 className="text-xl font-bold">{currentBrand.name}</h2>
        <div className="mt-2">
          {currentProducts.length > 0 ? (
            <ul className="grid grid-cols-2">
              {currentProducts.map((product) => (
                <li key={product.id}>
                  <RecommendedBrandGridCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No products available for this brand.</p>
          )}
        </div>
      </div>
    </div>
  );
}

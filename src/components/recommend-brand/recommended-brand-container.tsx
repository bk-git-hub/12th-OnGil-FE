import { Product } from '@/types/products';
import { useState } from 'react';

interface RecommendedBrandContainerProps {
  brands: string[];
  products0: Product[];
  products1: Product[];
  products2: Product[];
}

export default function RecommendedBrandContainer({
  brands,
  products0,
  products1,
  products2,
}: RecommendedBrandContainerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>(products0);

  return (
    <div className="flex">
      <button className="w-25 rounded-l-[10px] px-6 py-3"></button>
    </div>
  );
}

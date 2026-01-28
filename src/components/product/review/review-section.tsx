'use client';

import { ProductDetail } from '@/types/domain/product';
import { AiMaterialCarousel } from '@/components/product/review/ai-material-carousel';

interface ProductReviewContentProps {
  product: ProductDetail;
}

export function ProductReviewContent({ product }: ProductReviewContentProps) {
  return (
    <div className="space-y-8 px-4 py-4">
      <section>
        <AiMaterialCarousel
          materialDescription={product.materialDescription}
          materialName={product.materialOriginal}
        />
      </section>
    </div>
  );
}

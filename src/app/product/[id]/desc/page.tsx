import { getProductById } from '@/components/product/product-service';
import { ProductDescription } from '@/components/product/descriptions/product-description';
import { notFound } from 'next/navigation';

export default async function ProductDescPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return <ProductDescription product={product} />;
}

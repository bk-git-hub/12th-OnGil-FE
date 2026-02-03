import { Metadata } from 'next';
import { getProductById } from '@/components/product/product-service';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: '상품을 찾을 수 없습니다. | 온길' };

  return {
    title: `${product.name} | 온길`,
    description: `시니어 쇼핑몰 온길에서 ${product.name}을(를) 만나보세요.`,
    openGraph: {
      title: product.name,
      images: [product.thumbnailImageUrl],
    },
  };
}

export default async function ProductLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

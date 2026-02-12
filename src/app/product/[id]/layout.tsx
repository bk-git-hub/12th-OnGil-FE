import { Metadata } from 'next';
import { getProductDetail } from '@/app/actions/product';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

// 메타데이터 생성
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductDetail(Number(id));
    return {
      title: `${product.name} | 온길`,
      description: `시니어 쇼핑몰 온길에서 ${product.name}을(를) 만나보세요.`,
      openGraph: {
        title: product.name,
        images: [product.thumbnailImageUrl],
      },
    };
  } catch {
    return { title: '상품을 찾을 수 없습니다. | 온길' };
  }
}

export default async function ProductLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

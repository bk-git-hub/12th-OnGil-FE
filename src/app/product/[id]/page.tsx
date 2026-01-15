import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  // params 비동기 처리
  const { id } = await params;
  // 기본 페이지를 상품 설명 페이지로 리다이렉션
  redirect(`/product/${id}/desc`);
}

import { PRODUCTS } from '@/mocks/product-data';
import { CATEGORIES } from '@/mocks/category-data';

// 백엔드 API가 나오면 이 파일 fetch로 수정하면 됨.

// 카테고리 ID로 상품 목록 가져오기
export async function getProductsByCategoryId(categoryId: string) {
  if (categoryId.endsWith('-all')) {
    const parentId = categoryId.replace('-all', '');
    return PRODUCTS.filter((p) => p.categoryId.startsWith(parentId));
  }

  // 일반 카테고리 처리
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

// 상품 ID로 상세 정보 가져오기
export async function getProductById(productId: string) {
  // ex)fetch('/api/products/${productId}')같은 방식으로 추후 백엔드 연동시 사용
  return PRODUCTS.find((p) => p.id === productId) || null;
}

// 페이지 제목 가져오기
export async function getCategoryTitle(categoryId: string) {
  if (categoryId.endsWith('-all')) {
    const parentId = categoryId.replace('-all', '');
    const parent = CATEGORIES.find((c) => c.id === parentId);
    return parent ? `${parent.name} 전체` : '전체 상품';
  }

  const allSubs = CATEGORIES.flatMap((c) => c.subCategories);
  const sub = allSubs.find((s) => s.id === categoryId);
  return sub ? sub.name : '상품 목록';
}

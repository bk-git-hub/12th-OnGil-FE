import { PRODUCTS } from '@/mocks/product-data';
import { CATEGORIES } from '@/mocks/category-data';

// 백엔드 API가 나오면 이 파일 fetch로 수정하면 됨.

/**
 * Fetch products by category ID.
 * 
 * @param categoryId - The category ID to filter products
 * @returns A promise that resolves to an array of products in the category
 */
export async function getProductsByCategoryId(categoryId: string) {
  if (categoryId.endsWith('-all')) {
    const parentId = categoryId.replace('-all', '');
    return PRODUCTS.filter((p) => p.categoryId.startsWith(parentId));
  }

  // 일반 카테고리 처리
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

/**
 * Fetch a single product by its ID.
 * 
 * @param productId - The ID of the product to fetch
 * @returns A promise that resolves to the product or null if not found
 */
export async function getProductById(productId: string) {
  // ex)fetch('/api/products/${productId}')같은 방식으로 추후 백엔드 연동시 사용
  return PRODUCTS.find((p) => p.id === productId) || null;
}

/**
 * Get the title for a category page.
 * 
 * @param categoryId - The category ID to get the title for
 * @returns A promise that resolves to the category title
 */
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

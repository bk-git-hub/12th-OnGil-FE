'use server';

import { api } from '@/lib/api-client';
import { rethrowNextError } from '@/lib/server-action-utils';
import type {
  Category,
  CategorySimple,
  SubCategory,
} from '@/types/domain/category';

/** 전체 카테고리 조회 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await api.get<Category[]>('/categories');
  } catch (error) {
    rethrowNextError(error);
    console.error('카테고리 조회 실패:', error);
    return [];
  }
}

/** 특정 상위 카테고리의 하위 카테고리 조회 */
export async function getSubCategories(
  categoryId: number,
): Promise<SubCategory[]> {
  try {
    return await api.get<SubCategory[]>(
      `/categories/${categoryId}/sub-categories`,
    );
  } catch (error) {
    rethrowNextError(error);
    console.error('하위 카테고리 조회 실패:', { error, categoryId });
    return [];
  }
}

/** 추천 하위 카테고리 조회 */
export async function getRecommendedSubCategories(
  count = 8,
): Promise<CategorySimple[]> {
  try {
    return await api.get<CategorySimple[]>('/categories/recommended-sub', {
      params: { count },
    });
  } catch (error) {
    rethrowNextError(error);
    console.error('추천 하위 카테고리 조회 실패:', { error, count });
    return [];
  }
}

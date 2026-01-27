'use server';

import { bodyInfoSchema, BodyInfoSchemaType } from '@/schemas/body-info';
import { revalidatePath } from 'next/cache';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function updateBodyInfoAction(
  data: BodyInfoSchemaType,
  currentPath?: string,
): Promise<ActionResponse> {
  // 1. 로그인 체크
  // const session = await getSession();
  // if (!session) return { success: false, message: '로그인이 필요합니다.' };

  // 2. 유효성 검사
  const validation = bodyInfoSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: '입력 값이 올바르지 않습니다.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    // 3. 로딩 상태 확인을 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('서버 저장 데이터:', validation.data);

    // 현재 보고 있는 페이지가 있다면 그 페이지를, 없다면 전체 상품 페이지 패턴을 갱신 => 최신 상태 유지
    if (currentPath) {
      revalidatePath(currentPath, 'page');
    } else {
      revalidatePath('/product/[id]', 'page');
    }

    return { success: true, message: '체형 정보가 저장되었습니다.' };
  } catch (error) {
    console.error('Save Error:', error);
    return { success: false, message: '저장 중 문제가 발생했습니다.' };
  }
}

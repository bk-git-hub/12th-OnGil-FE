'use server';

import { api } from '@/lib/api-client';
import type { UserInfoResDto } from '@/types/domain/user';

/** 내 정보 조회 */
export async function getUserInfo(): Promise<UserInfoResDto> {
  try {
    const user = await api.get<UserInfoResDto>('/users/me');
    if (typeof user.points === 'string') {
      user.points = Number((user.points as string).replace(/,/g, '')) || 0;
    }
    return user;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '유저 정보 조회에 실패했습니다.',
    );
  }
}

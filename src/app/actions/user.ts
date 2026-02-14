'use server';

import { auth } from '/auth';
import { api } from '@/lib/api-client';
import { rethrowNextError } from '@/lib/server-action-utils';
import type { ApiResponse } from '@/types/common';
import type { UserInfoResDto } from '@/types/domain/user';
import { revalidatePath } from 'next/cache';

const BASE_URL = process.env.BACKEND_API_URL;

interface ErrorResponse {
  message?: string;
}

function normalizeUserPoints(user: UserInfoResDto): UserInfoResDto {
  const rawPoints: unknown = user.points;
  if (typeof rawPoints === 'string') {
    user.points = Number(rawPoints.replace(/,/g, '')) || 0;
  }
  return user;
}

/** 내 정보 조회 */
export async function getUserInfo(): Promise<UserInfoResDto> {
  try {
    const user = await api.get<UserInfoResDto>('/users/me');
    return normalizeUserPoints(user);
  } catch (error) {
    rethrowNextError(error);
    console.error('유저 정보 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '유저 정보 조회에 실패했습니다.',
    );
  }
}

/** 프로필 이미지 수정 */
export async function updateProfileImageAction(
  imageFile: File,
): Promise<UserInfoResDto> {
  try {
    if (!imageFile || imageFile.size === 0) {
      throw new Error('업로드할 이미지 파일이 없습니다.');
    }
    if (!BASE_URL) {
      throw new Error('BACKEND_API_URL이 설정되지 않았습니다.');
    }

    const session = await auth();
    const accessToken = session?.accessToken as string | undefined;

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${BASE_URL}/users/me/profile-image`, {
      method: 'PATCH',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: formData,
      cache: 'no-store',
    });

    let responseData: unknown = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorData =
        typeof responseData === 'object' && responseData !== null
          ? (responseData as ErrorResponse)
          : { message: String(responseData) };
      throw new Error(
        errorData.message || '프로필 이미지 수정에 실패했습니다.',
      );
    }

    const user = (responseData as ApiResponse<UserInfoResDto>).data;

    revalidatePath('/me');
    revalidatePath('/me/edit');

    return normalizeUserPoints(user);
  } catch (error) {
    rethrowNextError(error);
    console.error('프로필 이미지 수정 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '프로필 이미지 수정에 실패했습니다.',
    );
  }
}

/** 프로필 이미지 삭제 */
export async function deleteProfileImageAction(): Promise<UserInfoResDto> {
  try {
    const user = await api.delete<UserInfoResDto>('/users/me/profile-image');

    revalidatePath('/me');
    revalidatePath('/me/edit');

    return normalizeUserPoints(user);
  } catch (error) {
    rethrowNextError(error);
    console.error('프로필 이미지 삭제 실패:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : '프로필 이미지 삭제에 실패했습니다.',
    );
  }
}

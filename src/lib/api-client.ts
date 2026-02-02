import { auth } from '/auth';
import { ApiResponse } from '@/types/common';

// 백엔드 API 기본 URL
const BASE_URL = process.env.BACKEND_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[] | undefined>;
}

// 에러 응답 구조 정의 (백엔드 에러 스펙에 맞춰 수정 가능)
interface ErrorResponse {
  message?: string;
  [key: string]: unknown; // 추가 필드 허용
}

//  커스텀 에러 클래스 정의 (any -> unknown 변경)
export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * 범용 Fetch Wrapper (Server-side 전용)
 */
async function fetchWrapper<T>(
  endpoint: string,
  method: HttpMethod,
  options: FetchOptions = {},
): Promise<T> {
  // 1. URL 조합
  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    url += `?${searchParams.toString()}`;
  }

  // 2. 헤더 설정
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  //  Auth.js v5: 서버 세션에서 토큰 가져오기
  const session = await auth();

  // 타입 에러가 난다면 types/next-auth.d.ts에서 Session 타입을 확장해야 합니다.
  const accessToken = session?.accessToken as string | undefined;

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // 3. 실제 Fetch 요청
  const response = await fetch(url, {
    method,
    headers,
    body: options.body,
    cache: options.cache || 'no-store',
    next: options.next,
  });

  // 4. 응답 처리 (any 대신 unknown 사용)
  let responseData: unknown;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  // 5. 에러 핸들링
  if (!response.ok) {
    // 401 처리 (필요 시 로직 추가)
    if (response.status === 401) {
      console.error('🔒 Unauthorized access - Token might be expired');
    }

    // unknown 타입인 responseData를 ErrorResponse로 단언하여 안전하게 접근
    const errorData =
      typeof responseData === 'object' && responseData !== null
        ? (responseData as ErrorResponse)
        : { message: String(responseData) };

    throw new ApiError(
      response.status,
      errorData.message || 'Something went wrong',
      responseData,
    );
  }

  // 6. 데이터 반환 (ApiResponse<T> 구조 해제)
  // unknown 타입을 ApiResponse<T>로 단언(Assertion)
  const result = responseData as ApiResponse<T>;
  return result.data;
}

//  api 객체: Request Body에 제네릭 D 추가 (기본값 unknown)
export const api = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetchWrapper<T>(url, 'GET', options),

  // D: Request Body Type
  post: <T, D = unknown>(url: string, body: D, options?: FetchOptions) =>
    fetchWrapper<T>(url, 'POST', {
      ...options,
      body: JSON.stringify(body),
    }),

  put: <T, D = unknown>(url: string, body: D, options?: FetchOptions) =>
    fetchWrapper<T>(url, 'PUT', {
      ...options,
      body: JSON.stringify(body),
    }),

  patch: <T, D = unknown>(url: string, body: D, options?: FetchOptions) =>
    fetchWrapper<T>(url, 'PATCH', {
      ...options,
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, options?: FetchOptions) =>
    fetchWrapper<T>(url, 'DELETE', options),
};

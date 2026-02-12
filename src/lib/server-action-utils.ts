/**
 * Next.js 내부 에러(redirect, notFound 등)는 digest 속성을 가지며,
 * catch 블록에서 삼키지 않고 반드시 re-throw 해야 합니다.
 */
export function rethrowNextError(error: unknown): void {
  if (error instanceof Error && 'digest' in error) throw error;
}

export type ActionResult = { success: boolean; message: string };

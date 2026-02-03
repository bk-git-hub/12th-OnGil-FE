'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyReviewState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
        <FileText className="h-8 w-8 text-gray-300" />
      </div>
      <p className="mb-1 text-lg font-bold text-gray-900">
        아직 작성된 리뷰가 없습니다
      </p>
      <p className="mb-6 text-sm text-gray-500">
        첫번째 리뷰를 작성해주세요
        <br />
        리뷰 쓰면 최대{' '}
        <span className="text-ongil-teal font-bold">2000원 적립!</span>
      </p>
    </div>
  );
}

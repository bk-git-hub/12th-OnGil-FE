'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReviewDetail } from '@/types/domain/review';
import { EVALUATION_MAP, EVALUATION_CONFIG } from './review-constants';

// 리뷰 상세 모달 컴포넌트

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: ReviewDetail['initialFirstAnswers'];
}

export function ReviewDetailModal({
  isOpen,
  onClose,
  answers,
}: ReviewDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-xl max-w-xl rounded-none bg-white p-4">
        <div className="mt-4 space-y-4">
          {EVALUATION_CONFIG.map(({ label, key }) => {
            const value = answers[key];
            const text = EVALUATION_MAP[value] || value;
            return (
              <div
                key={key}
                className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-3"
              >
                <span className="text-xl leading-normal font-normal not-italic">
                  {label}
                </span>
                <div className="border-ongil-teal flex max-w-[200px] justify-center rounded-3xl border p-2">
                  <span className="text-xl leading-normal font-normal not-italic">
                    {text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          variant="outline"
          className="bg-ongil-teal w-full rounded-xl border-none py-6 text-base font-bold text-white hover:bg-teal-600 hover:text-white"
          onClick={onClose}
        >
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
}

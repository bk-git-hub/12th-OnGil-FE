'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

export function BodyInfoModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back(); // 모달이 닫히면 뒤로 가기 (URL 복귀)
    }
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-white" />
      <DialogContent className="h-screen w-screen max-w-full gap-0 rounded-none border-none bg-white p-0 shadow-none duration-200 [&>button]:hidden">
        <DialogTitle className="sr-only">체형 정보 입력</DialogTitle>
        <DialogDescription className="sr-only">
          체형 정보를 입력하거나 수정하는 전체 화면입니다.
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

// 검색 모달 컴포넌트

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay className="bg-white/80 backdrop-blur-sm" />

      <DialogContent className="h-screen w-screen max-w-full gap-0 border-none bg-white p-0 shadow-none duration-200 sm:max-w-lg [&>button]:hidden">
        <DialogTitle className="sr-only">검색 모달</DialogTitle>
        <DialogDescription className="sr-only">
          모달 팝업 내용입니다. 이전 페이지로 돌아가려면 닫기를 누르세요.
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BodyInfoForm } from './body-info-form';
import { UserBodyInfo } from '@/mocks/size';

interface BodyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserBodyInfo | null;
}

export function BodyInfoModal({
  isOpen,
  onClose,
  userInfo,
}: BodyInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-xl font-bold text-gray-900">
            신체 정보를 입력해주세요
          </DialogTitle>
        </DialogHeader>

        {/* 저장 성공 시 모달 닫기 */}
        <BodyInfoForm initialData={userInfo} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}

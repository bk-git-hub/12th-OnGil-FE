'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteOrder } from '@/app/actions/order';

interface DeleteOrderButtonProps {
  orderId: number;
}

export default function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteOrder(orderId);
      router.replace('/orders');
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '주문 삭제에 실패했습니다.',
      );
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        className="bg-ongil-teal mt-8 w-full rounded-xl py-4 text-2xl text-white"
        onClick={() => setShowModal(true)}
      >
        주문 기록 삭제하기
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-5 w-full max-w-md rounded-2xl bg-white p-6">
            <p className="mb-6 text-center text-xl font-bold">
              주문 기록을 삭제하시겠습니까?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="rounded-xl bg-[#D9D9D9] py-3 text-lg"
                onClick={() => setShowModal(false)}
                disabled={deleting}
              >
                아니요
              </button>
              <button
                className="bg-ongil-teal rounded-xl py-3 text-lg text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '삭제 중...' : '네'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

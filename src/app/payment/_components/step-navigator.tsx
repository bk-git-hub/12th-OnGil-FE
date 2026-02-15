'use client';

import { useSearchParams } from 'next/navigation';
import { CloseButton } from '@/components/ui/close-button';
import { cn } from '@/lib/utils';
import { SECTIONS } from './constants';

interface Props {
  activeStep: string;
  onStepChange: (id: string) => void;
}

export default function StepNavigator({ activeStep, onStepChange }: Props) {
  const searchParams = useSearchParams();

  const steps = [
    { id: SECTIONS.ITEMS, label: '주문정보\n확인' },
    { id: SECTIONS.SHIPPING, label: '배송지\n확인' },
    { id: SECTIONS.PAYMENT, label: '적립금/캐시\n 확인' },
  ];

  const productId = searchParams.get('productId');
  const backHref =
    searchParams.get('cart') === 'true'
      ? '/cart'
      : productId
        ? `/product/${productId}`
        : undefined;

  // 현재 활성 단계 계산 (activeStep이 비어있으면 첫 번째 단계로 간주)
  const currentId = activeStep || steps[0].id;

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex((s) => s.id === currentId);
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    if (stepIndex === currentIndex) return 'active';
    return 'inactive';
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full max-w-md bg-white backdrop-blur-md">
        {/* 1. 타이틀 바 */}
        <div className="mt-8 flex h-14 items-center gap-4 px-6">
          <CloseButton href={backHref} replace={true} />
          <h1 className="flex-1 pr-8 text-center text-3xl leading-normal font-semibold">
            주문/결제
          </h1>
        </div>

        {/* 2. 스텝 내비게이션 바 */}
        <nav className="mt-8 w-full text-base leading-4 font-semibold text-[#999999]">
          <div className="mx-auto">
            <div className="flex w-full justify-between gap-[30px] px-6">
              {/* 스텝 버튼들 */}
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                const isActive = status === 'active';

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <button
                      type="button"
                      onClick={() => onStepChange(step.id)}
                      className="group relative flex flex-col items-center justify-center"
                    >
                      <div
                        className={cn(
                          'flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all duration-300',
                          isActive
                            ? 'border-ongil-teal border-2 bg-[rgba(169,255,215,0.45)] shadow-[inset_0_6px_6px_rgba(0,0,0,0.25)]'
                            : 'border-[#999999] bg-gray-50',
                        )}
                      >
                        <span
                          className={cn(
                            'text-center',
                            isActive
                              ? 'text-ongil-teal'
                              : 'text-gray-400 group-hover:text-gray-500',
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* 헤더 높이만큼 공간 확보 */}
      <div className="h-[220px] w-full" aria-hidden="true" />
    </>
  );
}

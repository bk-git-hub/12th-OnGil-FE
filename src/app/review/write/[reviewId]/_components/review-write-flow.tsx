'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  patchReviewStep1Action,
  patchReviewStep2MaterialAction,
  patchReviewStep2SizeAction,
  ReviewStep1ResponseData,
  submitReviewAction,
} from '@/app/actions/review';

type FlowStep = 1 | 2 | 3;

interface ReviewWriteFlowProps {
  reviewId: number;
  orderItemId?: number;
  productId?: number;
}

function parseCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLineSeparated(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ReviewWriteFlow({
  reviewId,
  orderItemId,
  productId,
}: ReviewWriteFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>(1);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [clothingCategory, setClothingCategory] = useState('TOP');
  const [rating, setRating] = useState(5);
  const [sizeAnswer, setSizeAnswer] = useState('COMFORTABLE');
  const [colorAnswer, setColorAnswer] = useState('SAME_AS_SCREEN');
  const [materialAnswer, setMaterialAnswer] = useState('NORMAL');

  const [step1Result, setStep1Result] = useState<ReviewStep1ResponseData | null>(
    null,
  );

  const [fitIssuePartsInput, setFitIssuePartsInput] = useState('');
  const [featureTypesInput, setFeatureTypesInput] = useState('TEXTURE');

  const [textReview, setTextReview] = useState('');
  const [reviewImageUrlsInput, setReviewImageUrlsInput] = useState('');
  const [sizeReviewInput, setSizeReviewInput] = useState('');
  const [materialReviewInput, setMaterialReviewInput] = useState('');

  const needsSizeSecondary = step1Result?.needsSizeSecondaryQuestion ?? true;
  const needsMaterialSecondary = step1Result?.needsMaterialSecondaryQuestion ?? true;

  const availableBodyPartsText = useMemo(() => {
    const bodyParts = step1Result?.availableBodyParts ?? [];
    return bodyParts.length > 0 ? bodyParts.join(', ') : '-';
  }, [step1Result]);

  const handleStep1Next = () => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(async () => {
      const result = await patchReviewStep1Action(reviewId, {
        clothingCategory,
        rating,
        sizeAnswer,
        colorAnswer,
        materialAnswer,
      });

      if (!result.success || !result.data) {
        setErrorMessage(result.message || '1단계 저장에 실패했습니다.');
        return;
      }

      setStep1Result(result.data);
      setSuccessMessage('1단계 저장 완료');
      setStep(2);
    });
  };

  const handleStep2Next = () => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(async () => {
      if (needsSizeSecondary) {
        const sizeResult = await patchReviewStep2SizeAction(reviewId, {
          fitIssueParts: parseCommaSeparated(fitIssuePartsInput),
        });

        if (!sizeResult.success) {
          setErrorMessage(sizeResult.message || '2단계 사이즈 저장에 실패했습니다.');
          return;
        }
      }

      if (needsMaterialSecondary) {
        const materialResult = await patchReviewStep2MaterialAction(reviewId, {
          featureTypes: parseCommaSeparated(featureTypesInput),
        });

        if (!materialResult.success) {
          setErrorMessage(
            materialResult.message || '2단계 소재 저장에 실패했습니다.',
          );
          return;
        }
      }

      setSuccessMessage('2단계 저장 완료');
      setStep(3);
    });
  };

  const handleSubmit = () => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(async () => {
      const result = await submitReviewAction(reviewId, {
        textReview,
        reviewImageUrls: parseCommaSeparated(reviewImageUrlsInput),
        sizeReview: parseLineSeparated(sizeReviewInput),
        materialReview: parseLineSeparated(materialReviewInput),
      });

      if (!result.success) {
        setErrorMessage(result.message || '리뷰 제출에 실패했습니다.');
        return;
      }

      setSuccessMessage('리뷰 제출 완료');
      router.replace('/reviews');
    });
  };

  return (
    <section className="space-y-4 px-5 py-6">
      <p className="text-lg font-semibold text-black">리뷰 ID: {reviewId}</p>
      <p className="text-sm text-[#666666]">
        orderItemId: {orderItemId ?? '-'} / productId: {productId ?? '-'}
      </p>
      <p className="text-sm text-[#666666]">현재 단계: STEP {step}</p>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      {step === 1 ? (
        <div className="space-y-3 rounded-xl border border-[#d9d9d9] p-4">
          <h2 className="text-lg font-semibold">STEP 1</h2>

          <label className="block text-sm">
            <span>clothingCategory</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={clothingCategory}
              onChange={(e) => setClothingCategory(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>rating (1~5)</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </label>

          <label className="block text-sm">
            <span>sizeAnswer</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={sizeAnswer}
              onChange={(e) => setSizeAnswer(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>colorAnswer</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={colorAnswer}
              onChange={(e) => setColorAnswer(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>materialAnswer</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={materialAnswer}
              onChange={(e) => setMaterialAnswer(e.target.value)}
            />
          </label>

          <button
            type="button"
            onClick={handleStep1Next}
            disabled={isPending}
            className="w-full rounded-lg bg-[#005b5e] py-2 text-white disabled:opacity-60"
          >
            {isPending ? '저장 중...' : '다음 단계'}
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3 rounded-xl border border-[#d9d9d9] p-4">
          <h2 className="text-lg font-semibold">STEP 2</h2>

          <p className="text-sm text-[#666666]">
            needsSizeSecondaryQuestion: {String(needsSizeSecondary)}
          </p>
          <p className="text-sm text-[#666666]">
            needsMaterialSecondaryQuestion: {String(needsMaterialSecondary)}
          </p>
          <p className="text-sm text-[#666666]">availableBodyParts: {availableBodyPartsText}</p>

          <label className="block text-sm">
            <span>fitIssueParts (comma separated)</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={fitIssuePartsInput}
              onChange={(e) => setFitIssuePartsInput(e.target.value)}
              disabled={!needsSizeSecondary}
            />
          </label>

          <label className="block text-sm">
            <span>featureTypes (comma separated)</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={featureTypesInput}
              onChange={(e) => setFeatureTypesInput(e.target.value)}
              disabled={!needsMaterialSecondary}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
                setStep(1);
              }}
              disabled={isPending}
              className="rounded-lg border border-[#cfcfcf] py-2"
            >
              이전 단계
            </button>
            <button
              type="button"
              onClick={handleStep2Next}
              disabled={isPending}
              className="rounded-lg bg-[#005b5e] py-2 text-white disabled:opacity-60"
            >
              {isPending ? '저장 중...' : '다음 단계'}
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3 rounded-xl border border-[#d9d9d9] p-4">
          <h2 className="text-lg font-semibold">STEP 3 (최종 제출)</h2>

          <label className="block text-sm">
            <span>textReview</span>
            <textarea
              className="mt-1 min-h-24 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={textReview}
              onChange={(e) => setTextReview(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>reviewImageUrls (comma separated)</span>
            <input
              className="mt-1 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={reviewImageUrlsInput}
              onChange={(e) => setReviewImageUrlsInput(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>sizeReview (line separated)</span>
            <textarea
              className="mt-1 min-h-20 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={sizeReviewInput}
              onChange={(e) => setSizeReviewInput(e.target.value)}
            />
          </label>

          <label className="block text-sm">
            <span>materialReview (line separated)</span>
            <textarea
              className="mt-1 min-h-20 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={materialReviewInput}
              onChange={(e) => setMaterialReviewInput(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
                setStep(2);
              }}
              disabled={isPending}
              className="rounded-lg border border-[#cfcfcf] py-2"
            >
              이전 단계
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-[#005b5e] py-2 text-white disabled:opacity-60"
            >
              {isPending ? '제출 중...' : '리뷰 제출'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

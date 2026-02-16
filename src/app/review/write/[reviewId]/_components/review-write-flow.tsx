'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import {
  generateMaterialAiReviewAction,
  generateSizeAiReviewAction,
  patchReviewStep1Action,
  patchReviewStep2MaterialAction,
  patchReviewStep2SizeAction,
  ReviewStep1ResponseData,
  submitReviewAction,
} from '@/app/actions/review';

type FlowStep = 1 | 2;

interface ReviewWriteFlowProps {
  reviewId: number;
  clothingCategory: string;
  initialStep1Answers?: {
    sizeAnswer?: string | null;
    colorAnswer?: string | null;
    materialAnswer?: string | null;
  };
  initialRating?: number | null;
}

const categoryNameMap: Record<string, string> = {
  OUTER: '아우터',
  TOP: '상의',
  SKIRT: '스커트',
  PANTS: '팬츠',
  DRESS: '원피스',
};

const sizeAnswerOptions = [
  { value: 'TIGHT_IMMEDIATELY', label: '숨막히게 답답' },
  { value: 'TIGHT_WHEN_MOVING', label: '살짝 답답' },
  { value: 'COMFORTABLE', label: '편함' },
  { value: 'LOOSE', label: '헐렁함' },
  { value: 'TOO_BIG_NEED_ALTERATION', label: '너무 큼' },
];

const colorAnswerOptions = [
  { value: 'BRIGHTER_THAN_SCREEN', label: '화면보다 밝음' },
  { value: 'SAME_AS_SCREEN', label: '화면과 똑같음' },
  { value: 'DARKER_THAN_SCREEN', label: '어두움' },
];

const materialAnswerOptions = [
  { value: 'VERY_GOOD', label: '너무 좋음' },
  { value: 'GOOD', label: '좋음' },
  { value: 'NORMAL', label: '무난함' },
  { value: 'BAD', label: '아쉬움' },
  { value: 'VERY_BAD', label: '너무 아쉬움' },
];

const materialFeatureTypeOptions = [
  { value: 'TEXTURE', label: '촉감' },
  { value: 'WEIGHT', label: '무게감' },
  { value: 'WRINKLE', label: '구김 정도' },
  { value: 'THICKNESS', label: '두께감' },
  { value: 'PILLING', label: '보풀' },
  { value: 'TRANSPARENCY', label: '비침 정도' },
];

const STEP2_AUTOSAVE_DEBOUNCE_MS = 500;

function parseCommaSeparated(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ReviewWriteFlow({
  reviewId,
  clothingCategory,
  initialStep1Answers,
  initialRating,
}: ReviewWriteFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>(1);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [step2AutoSaveStatus, setStep2AutoSaveStatus] = useState('');

  const [rating, setRating] = useState(
    typeof initialRating === 'number' && initialRating > 0 ? initialRating : 5,
  );
  const [sizeAnswer, setSizeAnswer] = useState(
    initialStep1Answers?.sizeAnswer ?? '',
  );
  const [colorAnswer, setColorAnswer] = useState(
    initialStep1Answers?.colorAnswer ?? '',
  );
  const [materialAnswer, setMaterialAnswer] = useState(
    initialStep1Answers?.materialAnswer ?? '',
  );

  const [step1Result, setStep1Result] = useState<ReviewStep1ResponseData | null>(
    null,
  );

  const [fitIssueParts, setFitIssueParts] = useState<string[]>([]);
  const [featureTypes, setFeatureTypes] = useState<string[]>([]);
  const sizeDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const materialDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastSavedFitIssuePartsKeyRef = useRef('');
  const lastSavedFeatureTypesKeyRef = useRef('');

  const [textReview, setTextReview] = useState('');
  const [reviewImageUrlsInput, setReviewImageUrlsInput] = useState('');
  const [sizeReviewItems, setSizeReviewItems] = useState<string[]>([]);
  const [materialReviewItems, setMaterialReviewItems] = useState<string[]>([]);

  const needsSizeSecondary = step1Result?.needsSizeSecondaryQuestion ?? true;
  const needsMaterialSecondary = step1Result?.needsMaterialSecondaryQuestion ?? true;

  const availableBodyPartsText = useMemo(() => {
    const bodyParts = step1Result?.availableBodyParts ?? [];
    return bodyParts.length > 0 ? bodyParts.join(', ') : '-';
  }, [step1Result]);

  useEffect(() => {
    return () => {
      if (sizeDebounceTimerRef.current) {
        clearTimeout(sizeDebounceTimerRef.current);
      }
      if (materialDebounceTimerRef.current) {
        clearTimeout(materialDebounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (step !== 2 || !step1Result || !needsSizeSecondary) {
      if (sizeDebounceTimerRef.current) {
        clearTimeout(sizeDebounceTimerRef.current);
      }
      return;
    }
    if (fitIssueParts.length === 0) {
      return;
    }

    const fitIssuePartsKey = [...fitIssueParts].sort().join('|');
    if (fitIssuePartsKey === lastSavedFitIssuePartsKeyRef.current) {
      return;
    }

    if (sizeDebounceTimerRef.current) {
      clearTimeout(sizeDebounceTimerRef.current);
    }

    setStep2AutoSaveStatus('사이즈 답변 자동 저장 대기 중...');
    sizeDebounceTimerRef.current = setTimeout(async () => {
      setStep2AutoSaveStatus('사이즈 답변 자동 저장 중...');
      const result = await patchReviewStep2SizeAction(reviewId, {
        fitIssueParts,
      });

      if (!result.success) {
        setErrorMessage(result.message || '2단계 사이즈 저장에 실패했습니다.');
        setStep2AutoSaveStatus('');
        return;
      }

      lastSavedFitIssuePartsKeyRef.current = fitIssuePartsKey;
      setStep2AutoSaveStatus('사이즈 답변 자동 저장됨');
    }, STEP2_AUTOSAVE_DEBOUNCE_MS);
  }, [fitIssueParts, needsSizeSecondary, reviewId, step, step1Result]);

  useEffect(() => {
    if (step !== 2 || !step1Result || !needsMaterialSecondary) {
      if (materialDebounceTimerRef.current) {
        clearTimeout(materialDebounceTimerRef.current);
      }
      return;
    }
    if (featureTypes.length === 0) {
      return;
    }

    const featureTypesKey = [...featureTypes].sort().join('|');
    if (featureTypesKey === lastSavedFeatureTypesKeyRef.current) {
      return;
    }

    if (materialDebounceTimerRef.current) {
      clearTimeout(materialDebounceTimerRef.current);
    }

    setStep2AutoSaveStatus('소재 답변 자동 저장 대기 중...');
    materialDebounceTimerRef.current = setTimeout(async () => {
      setStep2AutoSaveStatus('소재 답변 자동 저장 중...');
      const result = await patchReviewStep2MaterialAction(reviewId, {
        featureTypes,
      });

      if (!result.success) {
        setErrorMessage(result.message || '2단계 소재 저장에 실패했습니다.');
        setStep2AutoSaveStatus('');
        return;
      }

      lastSavedFeatureTypesKeyRef.current = featureTypesKey;
      setStep2AutoSaveStatus('소재 답변 자동 저장됨');
    }, STEP2_AUTOSAVE_DEBOUNCE_MS);
  }, [featureTypes, needsMaterialSecondary, reviewId, step, step1Result]);

  const handleStep1Next = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!sizeAnswer || !colorAnswer || !materialAnswer) {
      setErrorMessage('STEP 1의 모든 질문에 답변해 주세요.');
      return;
    }

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
      setFitIssueParts([]);
      setFeatureTypes([]);
      lastSavedFitIssuePartsKeyRef.current = '';
      lastSavedFeatureTypesKeyRef.current = '';
      setStep2AutoSaveStatus('');
      setSuccessMessage('1단계 저장 완료');
      setStep(2);
    });
  };

  const handleStep2Submit = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (needsSizeSecondary && fitIssueParts.length === 0) {
      setErrorMessage('불편한 부위를 1개 이상 선택해 주세요.');
      return;
    }
    if (needsMaterialSecondary && featureTypes.length === 0) {
      setErrorMessage('소재 특징을 1개 이상 선택해 주세요.');
      return;
    }

    startTransition(async () => {
      if (needsSizeSecondary) {
        const sizeResult = await patchReviewStep2SizeAction(reviewId, {
          fitIssueParts,
        });

        if (!sizeResult.success) {
          setErrorMessage(sizeResult.message || '2단계 사이즈 저장에 실패했습니다.');
          return;
        }
      }

      if (needsMaterialSecondary) {
        const materialResult = await patchReviewStep2MaterialAction(reviewId, {
          featureTypes,
        });

        if (!materialResult.success) {
          setErrorMessage(
            materialResult.message || '2단계 소재 저장에 실패했습니다.',
          );
          return;
        }
      }

      const result = await submitReviewAction(reviewId, {
        textReview,
        reviewImageUrls: parseCommaSeparated(reviewImageUrlsInput),
        sizeReview: sizeReviewItems.map((item) => item.trim()).filter(Boolean),
        materialReview: materialReviewItems
          .map((item) => item.trim())
          .filter(Boolean),
      });

      if (!result.success) {
        setErrorMessage(result.message || '리뷰 제출에 실패했습니다.');
        return;
      }

      setSuccessMessage('리뷰 제출 완료');
      router.replace('/reviews');
    });
  };

  const handleGenerateAiReviews = () => {
    setErrorMessage('');
    setSuccessMessage('');
    startTransition(async () => {
      const [sizeResult, materialResult] = await Promise.all([
        generateSizeAiReviewAction(reviewId),
        generateMaterialAiReviewAction(reviewId),
      ]);

      if (!sizeResult.success || !sizeResult.data) {
        setErrorMessage(sizeResult.message || '사이즈 AI 생성에 실패했습니다.');
        return;
      }
      if (!materialResult.success || !materialResult.data) {
        setErrorMessage(materialResult.message || '소재 AI 생성에 실패했습니다.');
        return;
      }

      setSizeReviewItems(sizeResult.data.aiGeneratedReviews ?? []);
      setMaterialReviewItems(materialResult.data.aiGeneratedReviews ?? []);
      setSuccessMessage('AI 문장을 불러왔습니다.');
    });
  };

  return (
    <section className="space-y-4 px-5 py-6">
      <p className="text-lg font-semibold text-black">리뷰 ID: {reviewId}</p>
      <p className="text-sm text-[#666666]">
        카테고리: {categoryNameMap[clothingCategory] ?? clothingCategory}
      </p>
      <p className="text-sm text-[#666666]">현재 단계: STEP {step}</p>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      {step === 1 ? (
        <div className="space-y-3 rounded-xl border border-[#d9d9d9] p-4">
          <h2 className="text-lg font-semibold">STEP 1</h2>

          <label className="block text-sm font-medium">
            <span>Q. 평점은 몇 점인가요?</span>
            <input
              type="number"
              min={1}
              max={5}
              className="mt-2 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">Q. 착용 시 사이즈가 어땠나요?</p>
            <div className="space-y-2">
              {sizeAnswerOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="sizeAnswer"
                    value={option.value}
                    checked={sizeAnswer === option.value}
                    onChange={() => setSizeAnswer(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Q. 제품의 색깔은 어때요?</p>
            <div className="space-y-2">
              {colorAnswerOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="colorAnswer"
                    value={option.value}
                    checked={colorAnswer === option.value}
                    onChange={() => setColorAnswer(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Q. 소재는 어때요?</p>
            <div className="space-y-2">
              {materialAnswerOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="materialAnswer"
                    value={option.value}
                    checked={materialAnswer === option.value}
                    onChange={() => setMaterialAnswer(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

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
          <h2 className="text-lg font-semibold">STEP 2 (리뷰 제출)</h2>

          <div className="rounded-md border border-[#e5e5e5] bg-[#f7f7f7] p-3">
            <p className="mb-2 text-sm font-medium text-[#444444]">
              Step1 응답 JSON
            </p>
            <pre className="overflow-x-auto text-xs leading-relaxed text-black">
              {JSON.stringify(step1Result, null, 2)}
            </pre>
          </div>

          <p className="text-sm text-[#666666]">
            needsSizeSecondaryQuestion: {String(needsSizeSecondary)}
          </p>
          <p className="text-sm text-[#666666]">
            needsMaterialSecondaryQuestion: {String(needsMaterialSecondary)}
          </p>
          <p className="text-sm text-[#666666]">
            materialSecondaryType: {step1Result?.materialSecondaryType ?? '-'}
          </p>
          <p className="text-sm text-[#666666]">availableBodyParts: {availableBodyPartsText}</p>
          {step2AutoSaveStatus ? (
            <p className="text-sm text-[#005b5e]">{step2AutoSaveStatus}</p>
          ) : null}

          {needsSizeSecondary ? (
            <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
              <p className="text-sm font-medium">Q. 어느 부위가 불편했나요?</p>
              <div className="space-y-2">
                {(step1Result?.availableBodyParts ?? []).map((bodyPart) => (
                  <label
                    key={bodyPart}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={fitIssueParts.includes(bodyPart)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFitIssueParts((prev) => [...prev, bodyPart]);
                          return;
                        }
                        setFitIssueParts((prev) =>
                          prev.filter((item) => item !== bodyPart),
                        );
                      }}
                    />
                    <span>{bodyPart}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {needsMaterialSecondary ? (
            <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
              <p className="text-sm font-medium">
                Q. 소재의 어떤 점이
                {step1Result?.materialSecondaryType === 'NEGATIVE'
                  ? ' 아쉬웠나요?'
                  : ' 좋았나요?'}
              </p>
              <div className="space-y-2">
                {materialFeatureTypeOptions.map((feature) => (
                  <label
                    key={feature.value}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={featureTypes.includes(feature.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFeatureTypes((prev) => [...prev, feature.value]);
                          return;
                        }
                        setFeatureTypes((prev) =>
                          prev.filter((item) => item !== feature.value),
                        );
                      }}
                    />
                    <span>{feature.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateAiReviews}
              disabled={isPending}
              className="rounded-md border border-[#005b5e] px-3 py-1 text-sm font-medium text-[#005b5e] disabled:opacity-60"
            >
              AI 리뷰 생성
            </button>
          </div>

          <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
            <p className="text-sm font-medium">sizeReview 문장</p>
            <div className="space-y-2">
              {sizeReviewItems.map((item, index) => (
                <div key={`size-review-${index}`} className="flex gap-2">
                  <input
                    className="w-full rounded border border-[#cfcfcf] px-3 py-2 text-sm"
                    value={item}
                    onChange={(e) => {
                      const next = [...sizeReviewItems];
                      next[index] = e.target.value;
                      setSizeReviewItems(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSizeReviewItems((prev) =>
                        prev.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="rounded-md border border-[#cfcfcf] px-2 py-1 text-xs"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSizeReviewItems((prev) => [...prev, ''])}
              className="rounded-md border border-[#cfcfcf] px-2 py-1 text-xs"
            >
              문장 추가
            </button>
          </div>

          <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
            <p className="text-sm font-medium">materialReview 문장</p>
            <div className="space-y-2">
              {materialReviewItems.map((item, index) => (
                <div key={`material-review-${index}`} className="flex gap-2">
                  <input
                    className="w-full rounded border border-[#cfcfcf] px-3 py-2 text-sm"
                    value={item}
                    onChange={(e) => {
                      const next = [...materialReviewItems];
                      next[index] = e.target.value;
                      setMaterialReviewItems(next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMaterialReviewItems((prev) =>
                        prev.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="rounded-md border border-[#cfcfcf] px-2 py-1 text-xs"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMaterialReviewItems((prev) => [...prev, ''])}
              className="rounded-md border border-[#cfcfcf] px-2 py-1 text-xs"
            >
              문장 추가
            </button>
          </div>

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
              onClick={handleStep2Submit}
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

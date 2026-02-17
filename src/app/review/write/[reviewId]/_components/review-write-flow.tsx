'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

interface UploadReviewImagesApiResponse {
  status: string;
  timestamp: string;
  data: string[];
}

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
const MAX_REVIEW_IMAGE_COUNT = 5;
const MAX_REVIEW_IMAGE_TOTAL_BYTES = 50 * 1024 * 1024;
const STAR_VALUES = [1, 2, 3, 4, 5] as const;

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
  const [isImageUploading, setIsImageUploading] = useState(false);

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
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [sizeReviewItems, setSizeReviewItems] = useState<string[]>([]);
  const [materialReviewItems, setMaterialReviewItems] = useState<string[]>([]);

  const needsSizeSecondary = step1Result?.needsSizeSecondaryQuestion ?? true;
  const needsMaterialSecondary = step1Result?.needsMaterialSecondaryQuestion ?? true;

  const availableBodyPartsText = useMemo(() => {
    const bodyParts = step1Result?.availableBodyParts ?? [];
    return bodyParts.length > 0 ? bodyParts.join(', ') : '-';
  }, [step1Result]);
  const uploadedImageUrls = reviewImageUrls;

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
        reviewImageUrls,
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

  const handleUploadReviewImages = (files: File[]) => {
    setErrorMessage('');
    setSuccessMessage('');

    if (files.length === 0) {
      setErrorMessage('업로드할 이미지를 선택해 주세요.');
      return;
    }

    const existingUrls = uploadedImageUrls;
    if (existingUrls.length + files.length > MAX_REVIEW_IMAGE_COUNT) {
      setErrorMessage('리뷰 이미지는 최대 5장까지 등록할 수 있습니다.');
      return;
    }

    const selectedTotalBytes = files.reduce((sum, file) => sum + file.size, 0);
    if (selectedTotalBytes > MAX_REVIEW_IMAGE_TOTAL_BYTES) {
      setErrorMessage('선택한 이미지 용량 합이 너무 큽니다. (최대 50MB)');
      return;
    }

    setIsImageUploading(true);
    (async () => {
      try {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));

        const response = await fetch('/api/reviews/images', {
          method: 'POST',
          body: formData,
        });
        const payload = (await response.json()) as UploadReviewImagesApiResponse & {
          message?: string;
        };

        if (!response.ok) {
          setErrorMessage(payload.message || '리뷰 이미지 업로드에 실패했습니다.');
          return;
        }

        const mergedUrls = Array.from(new Set([...existingUrls, ...payload.data])).slice(
          0,
          5,
        );
        setReviewImageUrls(mergedUrls);
        setSuccessMessage('리뷰 이미지를 업로드했습니다.');
      } finally {
        setIsImageUploading(false);
      }
    })();
  };

  return (
    <section className="space-y-4 px-5 py-6">
      <div className="flex items-start justify-between px-2">
        <div className="flex flex-1 items-start">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={step === 1 ? '/icons/basic-info.svg' : '/icons/basic-info-gray.svg'}
              alt="기본정보 단계"
              width={48}
              height={48}
            />
            <span
              className={`text-sm font-medium ${
                step === 1 ? 'text-[#223435]' : 'text-[#8a8a8a]'
              }`}
            >
              기본 정보
            </span>
          </div>
          <div className="mt-6 h-[2px] flex-1 rounded-full bg-[#d9d9d9]">
            <div
              className={`h-full rounded-full bg-[#223435] transition-all duration-200 ${
                step === 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Image
            src={step === 2 ? '/icons/detail-info-active.svg' : '/icons/detail-info.svg'}
            alt="상세후기 단계"
            width={47}
            height={47}
          />
          <span
            className={`text-sm font-medium ${
              step === 2 ? 'text-[#223435]' : 'text-[#8a8a8a]'
            }`}
          >
            상세후기
          </span>
        </div>
      </div>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-2xl font-semibold text-black">Q. 이 상품 어때요?</p>
            <div className="flex items-center gap-2">
              {STAR_VALUES.map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star}점 선택`}
                  className="transition-transform active:scale-95"
                >
                  <Image
                    src={rating >= star ? '/icons/star.svg' : '/icons/star-gray.svg'}
                    alt=""
                    width={28}
                    height={28}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-2xl font-semibold text-black">1. 입었을 때 어때요?</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {sizeAnswerOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSizeAnswer(option.value)}
                  className="flex min-w-[58px] flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      sizeAnswer === option.value
                        ? 'border-[#005b5e] bg-[#005b5e]'
                        : 'border-[#d1d1d1] bg-white'
                    }`}
                  >
                    {sizeAnswer === option.value ? (
                      <span className="h-4 w-4 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="text-[11px] leading-[1.3] text-[#6f6f6f]">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-2xl font-semibold text-black">2. 제품 색깔은 어때요?</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {colorAnswerOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColorAnswer(option.value)}
                  className="flex min-w-[72px] flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      colorAnswer === option.value
                        ? 'border-[#005b5e] bg-[#005b5e]'
                        : 'border-[#d1d1d1] bg-white'
                    }`}
                  >
                    {colorAnswer === option.value ? (
                      <span className="h-4 w-4 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="text-[11px] leading-[1.3] text-[#6f6f6f]">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-2xl font-semibold text-black">3. 소재는 어때요?</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {materialAnswerOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMaterialAnswer(option.value)}
                  className="flex min-w-[58px] flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      materialAnswer === option.value
                        ? 'border-[#005b5e] bg-[#005b5e]'
                        : 'border-[#d1d1d1] bg-white'
                    }`}
                  >
                    {materialAnswer === option.value ? (
                      <span className="h-4 w-4 rounded-full bg-white" />
                    ) : null}
                  </span>
                  <span className="text-[11px] leading-[1.3] text-[#6f6f6f]">
                    {option.label}
                  </span>
                </button>
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

          <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
            <p className="text-sm font-medium">리뷰 이미지 업로드 (최대 5장)</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                const remaining = MAX_REVIEW_IMAGE_COUNT - uploadedImageUrls.length;
                const limitedFiles = files.slice(0, Math.max(remaining, 0));
                const totalBytes = limitedFiles.reduce((sum, file) => sum + file.size, 0);
                if (totalBytes > MAX_REVIEW_IMAGE_TOTAL_BYTES) {
                  setErrorMessage('선택한 이미지 용량 합이 너무 큽니다. (최대 50MB)');
                  return;
                }
                setErrorMessage('');
                handleUploadReviewImages(limitedFiles);
                e.currentTarget.value = '';
              }}
              disabled={
                isImageUploading || uploadedImageUrls.length >= MAX_REVIEW_IMAGE_COUNT
              }
              className="block w-full text-sm"
            />
            <p className="text-xs text-[#666666]">
              {isImageUploading
                ? '업로드 중...'
                : `등록됨: ${uploadedImageUrls.length}장`}
            </p>
            <p className="text-xs text-[#666666]">
              이미지를 선택하면 바로 업로드됩니다. (최대 5장, 총 50MB)
            </p>
            {uploadedImageUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {uploadedImageUrls.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="space-y-1 rounded-md border border-[#e5e5e5] p-1"
                  >
                    <div
                      className="h-20 w-full rounded bg-[#f3f3f3] bg-cover bg-center"
                      style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextUrls = uploadedImageUrls.filter(
                          (_, itemIndex) => itemIndex !== index,
                        );
                        setReviewImageUrls(nextUrls);
                      }}
                      className="w-full rounded border border-[#cfcfcf] py-1 text-xs"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

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

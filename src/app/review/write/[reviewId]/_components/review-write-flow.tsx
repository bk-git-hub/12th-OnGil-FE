'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
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
  productThumbnailImageUrl: string;
  productName: string;
  productBrandName: string;
  selectedOptionText: string;
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
  productThumbnailImageUrl,
  productName,
  productBrandName,
  selectedOptionText,
  initialStep1Answers,
  initialRating,
}: ReviewWriteFlowProps) {
  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return;
    element.style.height = '0px';
    element.style.height = `${element.scrollHeight}px`;
  };

  const router = useRouter();
  const [step, setStep] = useState<FlowStep>(1);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [toast, setToast] = useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);
  const [, setStep2AutoSaveStatus] = useState('');
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

  const [step1Result, setStep1Result] =
    useState<ReviewStep1ResponseData | null>(null);

  const [fitIssueParts, setFitIssueParts] = useState<string[]>([]);
  const [featureTypes, setFeatureTypes] = useState<string[]>([]);
  const sizeDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const materialDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastSavedFitIssuePartsKeyRef = useRef('');
  const lastSavedFeatureTypesKeyRef = useRef('');

  const [textReview, setTextReview] = useState('');
  const [reviewImageUrls, setReviewImageUrls] = useState<string[]>([]);
  const [sizeReviewItems, setSizeReviewItems] = useState<string[]>([]);
  const [materialReviewItems, setMaterialReviewItems] = useState<string[]>([]);
  const sizeTextareaRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const materialTextareaRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const [pendingSizeFocusIndex, setPendingSizeFocusIndex] = useState<number | null>(
    null,
  );
  const [pendingMaterialFocusIndex, setPendingMaterialFocusIndex] = useState<
    number | null
  >(null);

  const needsSizeSecondary = step1Result?.needsSizeSecondaryQuestion ?? true;
  const needsMaterialSecondary =
    step1Result?.needsMaterialSecondaryQuestion ?? true;
  const canGenerateSizeAiReview =
    !needsSizeSecondary || fitIssueParts.length > 0;
  const canGenerateMaterialAiReview =
    !needsMaterialSecondary || featureTypes.length > 0;
  const canGenerateCombinedAiReview =
    canGenerateSizeAiReview && canGenerateMaterialAiReview;

  const uploadedImageUrls = reviewImageUrls;

  useEffect(() => {
    if (pendingSizeFocusIndex === null) return;
    const target = sizeTextareaRefs.current[pendingSizeFocusIndex];
    if (target) {
      target.focus();
      autoResizeTextarea(target);
    }
    setPendingSizeFocusIndex(null);
  }, [pendingSizeFocusIndex, sizeReviewItems]);

  useEffect(() => {
    if (pendingMaterialFocusIndex === null) return;
    const target = materialTextareaRefs.current[pendingMaterialFocusIndex];
    if (target) {
      target.focus();
      autoResizeTextarea(target);
    }
    setPendingMaterialFocusIndex(null);
  }, [pendingMaterialFocusIndex, materialReviewItems]);

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
    if (errorMessage) {
      setToast({ type: 'error', message: errorMessage });
      setErrorMessage('');
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      setToast({ type: 'success', message: successMessage });
      setSuccessMessage('');
    }
  }, [successMessage]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

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
      setSuccessMessage('');
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
          setErrorMessage(
            sizeResult.message || '2단계 사이즈 저장에 실패했습니다.',
          );
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
      router.replace('/reviews?tab=written');
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
        setErrorMessage(
          materialResult.message || '소재 AI 생성에 실패했습니다.',
        );
        return;
      }

      setSizeReviewItems(sizeResult.data.aiGeneratedReviews ?? []);
      setMaterialReviewItems(materialResult.data.aiGeneratedReviews ?? []);
      setSuccessMessage('AI 문장을 불러왔습니다.');
    });
  };

  const handleGenerateSizeAiReview = () => {
    setErrorMessage('');
    setSuccessMessage('');
    startTransition(async () => {
      const result = await generateSizeAiReviewAction(reviewId);
      if (!result.success || !result.data) {
        setErrorMessage(result.message || '사이즈 AI 생성에 실패했습니다.');
        return;
      }
      setSizeReviewItems(result.data.aiGeneratedReviews ?? []);
      setSuccessMessage('사이즈 문장을 불러왔습니다.');
    });
  };

  const handleGenerateMaterialAiReview = () => {
    setErrorMessage('');
    setSuccessMessage('');
    startTransition(async () => {
      const result = await generateMaterialAiReviewAction(reviewId);
      if (!result.success || !result.data) {
        setErrorMessage(result.message || '소재 AI 생성에 실패했습니다.');
        return;
      }
      setMaterialReviewItems(result.data.aiGeneratedReviews ?? []);
      setSuccessMessage('소재 문장을 불러왔습니다.');
    });
  };

  const handleAddSizeReviewItem = () => {
    setSizeReviewItems((prev) => {
      setPendingSizeFocusIndex(prev.length);
      return [...prev, ''];
    });
  };

  const handleAddMaterialReviewItem = () => {
    setMaterialReviewItems((prev) => {
      setPendingMaterialFocusIndex(prev.length);
      return [...prev, ''];
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
        const uploadChunk = async (chunk: File[]) => {
          const formData = new FormData();
          chunk.forEach((file) => formData.append('images', file));

          const response = await fetch('/api/reviews/images', {
            method: 'POST',
            body: formData,
          });
          const payload =
            (await response.json()) as UploadReviewImagesApiResponse & {
              message?: string;
            };

          if (!response.ok) {
            throw new Error(payload.message || '리뷰 이미지 업로드에 실패했습니다.');
          }
          return payload.data;
        };

        let uploadedUrls: string[] = [];
        let partialFailed = false;

        try {
          uploadedUrls = await uploadChunk(files);
        } catch (batchError) {
          if (files.length === 1) {
            throw batchError;
          }

          for (const file of files) {
            try {
              const urls = await uploadChunk([file]);
              uploadedUrls = [...uploadedUrls, ...urls];
            } catch {
              partialFailed = true;
            }
          }

          if (uploadedUrls.length === 0) {
            throw batchError;
          }
        }

        const mergedUrls = Array.from(
          new Set([...existingUrls, ...uploadedUrls]),
        ).slice(0, MAX_REVIEW_IMAGE_COUNT);
        setReviewImageUrls(mergedUrls);
        if (partialFailed) {
          setSuccessMessage('일부 이미지만 업로드되었습니다.');
          setErrorMessage('일부 이미지 업로드에 실패했습니다.');
          return;
        }
        setSuccessMessage('리뷰 이미지를 업로드했습니다.');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : '리뷰 이미지 업로드에 실패했습니다.';
        setErrorMessage(message);
      } finally {
        setIsImageUploading(false);
      }
    })();
  };

  return (
    <section className={`space-y-4 pt-6 ${step === 1 ? 'pb-0' : 'pb-6'}`}>
      <div className="sticky top-[68px] z-[5] bg-white px-5 py-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 items-start">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={
                step === 1
                  ? '/icons/basic-info.svg'
                  : '/icons/basic-info-gray.svg'
              }
              alt="기본정보 단계"
              width={48}
              height={48}
            />
            <span
              className={`text-[18px] font-medium ${
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
              src={
                step === 2
                  ? '/icons/detail-info-active.svg'
                  : '/icons/detail-info.svg'
              }
              alt="상세후기 단계"
              width={47}
              height={47}
            />
            <span
              className={`text-[18px] font-medium ${
                step === 2 ? 'text-[#223435]' : 'text-[#8a8a8a]'
              }`}
            >
              상세후기
            </span>
          </div>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed right-5 bottom-24 left-5 z-50 flex justify-center">
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === 'error' ? 'bg-[#d14343]' : 'bg-[#0f6b5b]'
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div>
          <div className="space-y-6">
            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                Q. 이 상품 어때요?
              </p>
              <section className="rounded-2xl border border-black/50 bg-white p-4">
                <div className="flex gap-3">
                  <div className="relative h-[88px] w-[88px] overflow-hidden rounded-md bg-[#f1f1f1]">
                    <Image
                      src={productThumbnailImageUrl}
                      alt={productName}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-black">
                    <p className="truncate text-[16px] text-[#666666]">
                      {productBrandName}
                    </p>
                    <p className="line-clamp-2 text-[16px] font-semibold">
                      {productName}
                    </p>
                    <p className="mt-1 text-[16px] text-[#444444]">
                      {selectedOptionText}
                    </p>
                  </div>
                </div>
              </section>
              <div className="flex w-full items-center justify-between">
                {STAR_VALUES.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star}점 선택`}
                    className="flex-1 transition-transform active:scale-95"
                  >
                    <Image
                      src={
                        rating >= star
                          ? '/icons/star.svg'
                          : '/icons/star-gray.svg'
                      }
                      alt=""
                      width={62}
                      height={62}
                      className="mx-auto"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                1. 입었을 때 어때요?
              </p>
            <div className="-mx-5 grid grid-cols-5 gap-2 bg-[#F9FAFB] pt-5">
                {sizeAnswerOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSizeAnswer(option.value)}
                    className="flex w-full flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                        sizeAnswer === option.value
                          ? 'border-[#005b5e] bg-white'
                          : 'border-[#d1d1d1] bg-white'
                      }`}
                    >
                      {sizeAnswer === option.value ? (
                        <span className="h-7 w-7 rounded-full bg-[#005b5e]" />
                      ) : null}
                    </span>
                    <span className="text-ongil-teal text-base leading-[1.3] font-bold">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                2. 제품 색깔은 어때요?
              </p>
              <div className="-mx-5 grid grid-cols-3 gap-2 bg-[#F9FAFB] py-5">
                {colorAnswerOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorAnswer(option.value)}
                    className="flex w-full flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                        colorAnswer === option.value
                          ? 'border-[#005b5e] bg-white'
                          : 'border-[#d1d1d1] bg-white'
                      }`}
                    >
                      {colorAnswer === option.value ? (
                        <span className="h-7 w-7 rounded-full bg-[#005b5e]" />
                      ) : null}
                    </span>
                    <span className="text-ongil-teal text-base leading-[1.3] font-bold">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                3. 소재는 어때요?
              </p>
              <div className="-mx-5 grid grid-cols-5 gap-2 bg-[#F9FAFB] py-5">
                {materialAnswerOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMaterialAnswer(option.value)}
                    className="flex w-full flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                        materialAnswer === option.value
                          ? 'border-[#005b5e] bg-white'
                          : 'border-[#d1d1d1] bg-white'
                      }`}
                    >
                      {materialAnswer === option.value ? (
                        <span className="h-7 w-7 rounded-full bg-[#005b5e]" />
                      ) : null}
                    </span>
                    <span className="text-ongil-teal text-base leading-[1.3] font-bold">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 z-10 border-t border-[#999999] bg-white px-5 py-3">
            <button
              type="button"
              onClick={handleStep1Next}
              disabled={isPending}
              className="w-full rounded-lg bg-[#005b5e] py-3 text-[30px] leading-none font-semibold text-white disabled:opacity-60"
            >
              {isPending ? '저장 중...' : '다음 단계'}
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div className="mx-5 rounded-xl border border-[#00363D] bg-[linear-gradient(90deg,#A9FFD7_17%,#EFF6FF_100%)] px-5 py-4">
            <div className="flex items-start gap-3">
              <Image src="/icons/ai-star.svg" alt="" width={24} height={24} />
              <div className="space-y-1">
                <p className="text-xl font-semibold text-[#0b4a4f]">
                  후기 대신 써드려요
                </p>
                <p className="text-sm leading-relaxed text-[#0b4a4f]">
                  두 가지 질문에 답만 주시면
                  <br />
                  후기를 대신 써드릴게요
                </p>
              </div>
            </div>
          </div>

          {needsSizeSecondary ? (
            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                Q. 어느 부위가 불편했나요?
              </p>
              <div className="-mx-5 grid grid-cols-2 gap-3 bg-[#F9FAFB] px-5 py-5">
                {(step1Result?.availableBodyParts ?? []).map((bodyPart) => (
                  <button
                    key={bodyPart}
                    type="button"
                    onClick={() =>
                      setFitIssueParts((prev) =>
                        prev.includes(bodyPart)
                          ? prev.filter((item) => item !== bodyPart)
                          : [...prev, bodyPart],
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${
                      fitIssueParts.includes(bodyPart)
                        ? 'border-[#005b5e] bg-white'
                        : 'border-[#d1d1d1] bg-white'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                        fitIssueParts.includes(bodyPart)
                          ? 'border-[#005b5e] bg-white'
                          : 'border-[#d1d1d1] bg-white'
                      }`}
                    >
                      {fitIssueParts.includes(bodyPart) ? (
                        <span className="text-2xl leading-none font-bold text-[#005b5e]">
                          ✓
                        </span>
                      ) : null}
                    </span>
                    <span className="text-ongil-teal text-base font-bold">
                      {bodyPart}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {needsMaterialSecondary ? (
            <div className="mx-5 space-y-3">
              <p className="text-2xl font-semibold text-black">
                Q. 소재의 어떤 점이
                {step1Result?.materialSecondaryType === 'NEGATIVE'
                  ? ' 아쉬웠나요?'
                  : ' 좋았나요?'}
              </p>
              <div className="-mx-5 grid grid-cols-2 gap-3 bg-[#F9FAFB] px-5 py-5">
                {materialFeatureTypeOptions.map((feature) => (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() =>
                      setFeatureTypes((prev) =>
                        prev.includes(feature.value)
                          ? prev.filter((item) => item !== feature.value)
                          : [...prev, feature.value],
                      )
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left ${
                      featureTypes.includes(feature.value)
                        ? 'border-[#005b5e] bg-white'
                        : 'border-[#d1d1d1] bg-white'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                        featureTypes.includes(feature.value)
                          ? 'border-[#005b5e] bg-white'
                          : 'border-[#d1d1d1] bg-white'
                      }`}
                    >
                      {featureTypes.includes(feature.value) ? (
                        <span className="text-2xl leading-none font-bold text-[#005b5e]">
                          ✓
                        </span>
                      ) : null}
                    </span>
                    <span className="text-ongil-teal text-base font-bold">
                      {feature.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mx-5 space-y-3 rounded-xl border border-[#00363D] bg-[linear-gradient(90deg,#A9FFD7_17%,#EFF6FF_100%)] p-4">
            <button
              type="button"
              onClick={handleGenerateAiReviews}
              disabled={isPending || !canGenerateCombinedAiReview}
              className="w-full rounded-2xl bg-[#00363d] py-3 text-[24px] font-semibold leading-none text-white disabled:opacity-60"
            >
              후기 문장 받아보기
            </button>
            <p className="text-sm text-[#0b4a4f]">
              위 버튼을 클릭하면 후기 대신 작성 해드릴게요
            </p>
          </div>

          <div className="space-y-3 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              <Image src="/icons/ai-star.svg" alt="" width={18} height={18} />
              <p className="text-2xl font-semibold text-[#1c1c1c]">사이즈 관련</p>
            </div>
            <p className="text-sm text-[#7d7d7d]">
              {sizeReviewItems.length === 0
                ? '버튼을 클릭해서 문장을 생성할 수 있어요'
                : '각 문장은 클릭해서 수정 할 수 있어요'}
            </p>
            {sizeReviewItems.length === 0 ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGenerateSizeAiReview}
                  disabled={isPending || !canGenerateSizeAiReview}
                  className="w-full rounded-lg bg-[#00363d] py-2 text-lg font-semibold text-white disabled:opacity-60"
                >
                  사이즈 문장 생성
                </button>
                <button
                  type="button"
                  onClick={handleAddSizeReviewItem}
                  className="w-full rounded-lg border border-[#999] bg-white py-2 text-base font-medium text-[#1c1c1c]"
                >
                  직접 문장 추가
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="divide-y divide-[#e3e3e3] rounded-md bg-white">
                  {sizeReviewItems.map((item, index) => (
                    <div key={`size-review-${index}`} className="flex items-center">
                    <textarea
                      rows={1}
                      ref={(element) => {
                        sizeTextareaRefs.current[index] = element;
                        autoResizeTextarea(element);
                      }}
                      onInput={(e) => autoResizeTextarea(e.currentTarget)}
                      onBlur={(e) => {
                        if (!e.currentTarget.value.trim()) {
                          setSizeReviewItems((prev) =>
                            prev.filter((_, itemIndex) => itemIndex !== index),
                          );
                        }
                      }}
                      className="min-h-[56px] w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-4 text-lg leading-[1.35] font-medium whitespace-pre-wrap break-words text-[#1c1c1c] outline-none focus:border-ongil-teal focus:outline focus:outline-1 focus:outline-ongil-teal"
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
                        className="px-4 text-[28px] leading-none text-[#8e8e8e]"
                        aria-label="사이즈 문장 삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddSizeReviewItem}
                  className="w-full rounded-lg border border-[#999] bg-white py-2 text-base font-medium text-[#1c1c1c]"
                >
                  직접 문장 추가
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 bg-white px-5 py-4">
            <div className="flex items-center gap-2">
              <Image src="/icons/ai-star.svg" alt="" width={18} height={18} />
              <p className="text-2xl font-semibold text-[#1c1c1c]">소재 관련</p>
            </div>
            <p className="text-sm text-[#7d7d7d]">
              {materialReviewItems.length === 0
                ? '버튼을 클릭해서 문장을 생성할 수 있어요'
                : '각 문장은 클릭해서 수정 할 수 있어요'}
            </p>
            {materialReviewItems.length === 0 ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGenerateMaterialAiReview}
                  disabled={isPending || !canGenerateMaterialAiReview}
                  className="w-full rounded-lg bg-[#00363d] py-2 text-lg font-semibold text-white disabled:opacity-60"
                >
                  소재 문장 생성
                </button>
                <button
                  type="button"
                  onClick={handleAddMaterialReviewItem}
                  className="w-full rounded-lg border border-[#999] bg-white py-2 text-base font-medium text-[#1c1c1c]"
                >
                  직접 문장 추가
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="divide-y divide-[#e3e3e3] rounded-md bg-white">
                  {materialReviewItems.map((item, index) => (
                    <div key={`material-review-${index}`} className="flex items-center">
                    <textarea
                      rows={1}
                      ref={(element) => {
                        materialTextareaRefs.current[index] = element;
                        autoResizeTextarea(element);
                      }}
                      onInput={(e) => autoResizeTextarea(e.currentTarget)}
                      onBlur={(e) => {
                        if (!e.currentTarget.value.trim()) {
                          setMaterialReviewItems((prev) =>
                            prev.filter((_, itemIndex) => itemIndex !== index),
                          );
                        }
                      }}
                      className="min-h-[56px] w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent px-4 py-4 text-lg leading-[1.35] font-medium whitespace-pre-wrap break-words text-[#1c1c1c] outline-none focus:border-ongil-teal focus:outline focus:outline-1 focus:outline-ongil-teal"
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
                        className="px-4 text-[28px] leading-none text-[#8e8e8e]"
                        aria-label="소재 문장 삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMaterialReviewItem}
                  className="w-full rounded-lg border border-[#999] bg-white py-2 text-base font-medium text-[#1c1c1c]"
                >
                  직접 문장 추가
                </button>
              </div>
            )}
          </div>

          <label className="mx-5 block text-sm">
            <span className="text-2xl font-semibold text-black">기타</span>
            <textarea
              placeholder="추가로 하고싶은 말을 적어주세요"
              className="mt-3 min-h-24 w-full rounded border border-[#cfcfcf] px-3 py-2"
              value={textReview}
              onChange={(e) => setTextReview(e.target.value)}
            />
          </label>

          <div className="space-y-2 rounded-md border border-[#e5e5e5] p-3">
            <p className="text-sm font-medium">사진 첨부</p>
            <input
              id="review-image-upload-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                const remaining =
                  MAX_REVIEW_IMAGE_COUNT - uploadedImageUrls.length;
                const limitedFiles = files.slice(0, Math.max(remaining, 0));
                const totalBytes = limitedFiles.reduce(
                  (sum, file) => sum + file.size,
                  0,
                );
                if (totalBytes > MAX_REVIEW_IMAGE_TOTAL_BYTES) {
                  setErrorMessage(
                    '선택한 이미지 용량 합이 너무 큽니다. (최대 50MB)',
                  );
                  return;
                }
                setErrorMessage('');
                handleUploadReviewImages(limitedFiles);
                e.currentTarget.value = '';
              }}
              disabled={
                isImageUploading ||
                uploadedImageUrls.length >= MAX_REVIEW_IMAGE_COUNT
              }
              className="hidden"
            />
            <label
              htmlFor="review-image-upload-input"
              className={`flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-[#999] bg-[#f2f2f2] ${
                isImageUploading || uploadedImageUrls.length >= MAX_REVIEW_IMAGE_COUNT
                  ? 'cursor-not-allowed opacity-60'
                  : ''
              }`}
            >
              <Image src="/icons/upload.svg" alt="" width={48} height={48} />
              <span className="text-sm text-[#444444]">사진 선택하기</span>
            </label>
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

export const CLOTHING_CATEGORY_OPTIONS = [
  'OUTER',
  'TOP',
  'SKIRT',
  'PANTS',
  'DRESS',
] as const;

export type ClothingCategory = (typeof CLOTHING_CATEGORY_OPTIONS)[number];

export const SIZE_ANSWER_OPTIONS = [
  'TIGHT_IMMEDIATELY',
  'TIGHT_WHEN_MOVING',
  'LOOSE',
  'TOO_BIG_NEED_ALTERATION',
  'COMFORTABLE',
] as const;

export type SizeAnswer = (typeof SIZE_ANSWER_OPTIONS)[number];

export const MATERIAL_ANSWER_OPTIONS = [
  'VERY_GOOD',
  'GOOD',
  'NORMAL',
  'BAD',
  'VERY_BAD',
] as const;

export type MaterialAnswer = (typeof MATERIAL_ANSWER_OPTIONS)[number];

export const COLOR_ANSWER_OPTIONS = [
  'BRIGHTER_THAN_SCREEN',
  'SAME_AS_SCREEN',
  'DARKER_THAN_SCREEN',
] as const;

export type ColorAnswer = (typeof COLOR_ANSWER_OPTIONS)[number];

export const EVALUATION_MAP: Record<string, string> = {
  TIGHT_IMMEDIATELY: '숨막히게 답답',
  TIGHT_WHEN_MOVING: '살짝 답답',
  LOOSE: '헐렁함',
  TOO_BIG_NEED_ALTERATION: '너무 큼',
  COMFORTABLE: '편함',
  VERY_GOOD: '너무 좋음',
  GOOD: '좋음',
  NORMAL: '무난함',
  BAD: '아쉬움',
  VERY_BAD: '너무 아쉬움',
  BRIGHTER_THAN_SCREEN: '화면보다 밝음',
  SAME_AS_SCREEN: '화면과 똑같음',
  DARKER_THAN_SCREEN: '어두움',
};

export const SIZE_SECONDARY_REQUIRED_ANSWERS: readonly SizeAnswer[] = [
  'TIGHT_IMMEDIATELY',
  'TIGHT_WHEN_MOVING',
  'LOOSE',
  'TOO_BIG_NEED_ALTERATION',
] as const;

export const MATERIAL_SECONDARY_REQUIRED_ANSWERS: readonly MaterialAnswer[] = [
  'VERY_GOOD',
  'GOOD',
] as const;

export function isSizeSecondaryRequired(answer?: string): boolean {
  return (
    typeof answer === 'string' &&
    SIZE_SECONDARY_REQUIRED_ANSWERS.includes(answer as SizeAnswer)
  );
}

export function isMaterialSecondaryRequired(answer?: string): boolean {
  return (
    typeof answer === 'string' &&
    MATERIAL_SECONDARY_REQUIRED_ANSWERS.includes(answer as MaterialAnswer)
  );
}

export const EVALUATION_CONFIG = [
  { label: '사이즈', key: 'sizeAnswer' as const },
  { label: '색감', key: 'colorAnswer' as const },
  { label: '소재', key: 'materialAnswer' as const },
];

export const REVIEW_CONTENT_CONFIG = [
  { label: '사이즈', key: 'sizeReview' as const },
  { label: '소재', key: 'materialReview' as const },
  { label: '기타', key: 'textReview' as const },
];

export const MONTH_REVIEW_QUESTIONS = [
  {
    title: '한달 후 만족도',
    summaryKey: 'overall',
  },
  {
    title: '한달 후 변화',
    summaryKey: 'changes',
  },
] as const;

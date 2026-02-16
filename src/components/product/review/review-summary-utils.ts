import type {
  ProductReviewListItem,
  ReviewCategorySummary,
  ReviewStatDetail,
} from '@/types/domain/review';

export type SummaryAnswerKey =
  | 'sizeAnswer'
  | 'colorAnswer'
  | 'materialAnswer'
  | 'overall'
  | 'changes';

export function buildCategorySummaryFromReviews(
  category: string,
  reviews: ProductReviewListItem[],
  answerKey: SummaryAnswerKey,
): ReviewCategorySummary {
  const counts = new Map<string, number>();

  reviews.forEach((review) => {
    const answer =
      answerKey === 'overall' || answerKey === 'changes'
        ? review.oneMonthAnswers?.[answerKey]
        : (review.initialFirstAnswers ?? review.answers)?.[answerKey];

    if (!answer) return;
    counts.set(answer, (counts.get(answer) ?? 0) + 1);
  });

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);

  const answerStats: ReviewStatDetail[] = [...counts.entries()]
    .map(([answer, count]) => ({ answer, count }))
    .sort((a, b) => b.count - a.count)
    .map((item) => ({
      ...item,
      percentage: total === 0 ? 0 : Math.round((item.count / total) * 100),
    }));

  return {
    category,
    totalCount: total,
    topAnswer: answerStats[0]?.answer ?? null,
    topAnswerCount: answerStats[0]?.count ?? 0,
    answerStats,
  };
}

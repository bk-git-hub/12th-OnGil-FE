// 사이즈 관련 임시 데이터.
export type UserBodyInfo = {
  height: number;
  weight: number;
  usualTopSize: string;
  usualBottomSize: string;
  usualShoeSize: string;
};

export type SizeAnalysisResult = {
  recommendedSizes: string[];
  stats: {
    size: string;
    count: number;
    ratio: number;
  }[];
  similarUsersSample: {
    id: string;
    height: number;
    weight: number;
    size: string;
  }[];
};

// 유저 정보 가져오기
export async function fetchUserBodyInfo(): Promise<UserBodyInfo | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    height: 175,
    weight: 70,
    usualTopSize: 'M',
    usualBottomSize: 'L',
    usualShoeSize: '270',
  };
}

// 사이즈 분석 결과 가져오기
export async function fetchSizeAnalysis(
  productId: string,
  userHeight: number,
  userWeight: number,
): Promise<SizeAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    recommendedSizes: ['L'],
    stats: [
      { size: 'L', count: 120, ratio: 60 },
      { size: 'XL', count: 50, ratio: 25 },
      { size: 'M', count: 30, ratio: 15 },
    ],
    similarUsersSample: [
      { id: '1', height: 173, weight: 68, size: 'L' },
      { id: '2', height: 176, weight: 72, size: 'L' },
      { id: '3', height: 175, weight: 70, size: 'L' },
      { id: '4', height: 178, weight: 73, size: 'XL' },
    ],
  };
}

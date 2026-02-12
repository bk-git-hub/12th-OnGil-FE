export interface SizeOptionsData {
  topSizes: string[];
  bottomSizes: string[];
  shoeSizes: string[];
}

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

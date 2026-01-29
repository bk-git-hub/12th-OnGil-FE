export const EVALUATION_MAP: Record<string, string> = {
  large: '생각보다 커요',
  fit: '정사이즈예요',
  small: '생각보다 작아요',
  bright: '화면보다 밝아요',
  exact: '화면과 같아요',
  dark: '화면보다 어두워요',
  soft: '부드러워요',
  normal: '보통이에요',
  rough: '거칠어요',
};

export const EVALUATION_CONFIG = [
  { label: '사이즈', key: 'sizeAnswer' as const },
  { label: '색감', key: 'colorAnswer' as const },
  { label: '소재', key: 'materialAnswer' as const },
];

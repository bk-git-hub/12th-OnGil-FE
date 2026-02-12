const koreanNumberFormat = new Intl.NumberFormat('ko-KR');

export function formatPrice(price: number): string {
  return koreanNumberFormat.format(price);
}

export type PeriodPreset = 'custom' | '1m' | '6m' | '1y';

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const targetMonth = result.getMonth() - months;
  result.setMonth(targetMonth);
  if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    result.setDate(0);
  }
  return result;
}

export function getDefaultDateRange(preset: Exclude<PeriodPreset, 'custom'>) {
  const today = new Date();
  const endDate = formatLocalDate(today);

  let start: Date;
  if (preset === '1m') start = subtractMonths(today, 1);
  else if (preset === '6m') start = subtractMonths(today, 6);
  else
    start = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate(),
    );

  return { startDate: formatLocalDate(start), endDate };
}

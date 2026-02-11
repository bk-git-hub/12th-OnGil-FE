export type PeriodPreset = 'custom' | '1m' | '6m' | '1y';

export function getDefaultDateRange(preset: Exclude<PeriodPreset, 'custom'>) {
  const today = new Date();
  const end = today.toISOString().split('T')[0];
  const start = new Date();

  if (preset === '1m') start.setMonth(today.getMonth() - 1);
  else if (preset === '6m') start.setMonth(today.getMonth() - 6);
  else if (preset === '1y') start.setFullYear(today.getFullYear() - 1);

  return { startDate: start.toISOString().split('T')[0], endDate: end };
}

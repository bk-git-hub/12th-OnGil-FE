import en from '@/locales/en';
import ko from '@/locales/ko';

const dictionaries = {
  en,
  ko,
} as const;

export type AppLocale = keyof typeof dictionaries;
export type TranslationKey = 'recommendedBrand.noProducts';

export function getLocaleFromDocument(): AppLocale {
  if (typeof document === 'undefined') return 'ko';

  const docLang = document.documentElement.lang || navigator.language;
  return docLang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function t(locale: AppLocale, key: TranslationKey): string {
  if (key === 'recommendedBrand.noProducts') {
    return dictionaries[locale].recommendedBrand.noProducts;
  }

  return key;
}

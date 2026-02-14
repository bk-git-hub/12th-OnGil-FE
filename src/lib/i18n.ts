import en from '@/locales/en';
import ko from '@/locales/ko';

const dictionaries = {
  en,
  ko,
} as const;

export type AppLocale = keyof typeof dictionaries;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | Join<K, NestedKeyOf<T[K]>>
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<(typeof dictionaries)['ko']>;

export function getLocaleFromDocument(): AppLocale {
  if (typeof document === 'undefined') return 'ko';

  const docLang = document.documentElement.lang || navigator.language;
  return docLang.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

export function t(locale: AppLocale, key: TranslationKey): string {
  const resolved = key
    .split('.')
    .reduce<unknown>((acc, segment) => {
      if (!acc || typeof acc !== 'object') return undefined;
      return (acc as Record<string, unknown>)[segment];
    }, dictionaries[locale]);

  return typeof resolved === 'string' ? resolved : key;
}

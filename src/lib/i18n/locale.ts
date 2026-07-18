import type { AppLanguage } from '../types';

/** panchang-ts only supports English and Hindi for computed names. */
export function toLibraryLanguage(language: AppLanguage): 'en' | 'hi' {
  return language === 'hi' ? 'hi' : 'en';
}

const DATE_LOCALES: Record<AppLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  sa: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
};

export function getDateLocale(language: AppLanguage): string {
  return DATE_LOCALES[language];
}

const SCRIPT_FONT_CLASS: Record<AppLanguage, string | null> = {
  en: null,
  hi: 'font-devanagari',
  sa: 'font-devanagari',
  te: 'font-telugu',
  ta: 'font-tamil',
};

export function getScriptFontClass(language: AppLanguage): string | null {
  return SCRIPT_FONT_CLASS[language];
}

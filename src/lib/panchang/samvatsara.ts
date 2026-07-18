import type { AppLanguage } from '../types';
import { SAMVATSARA_TA, SAMVATSARA_TE } from '../i18n/samvatsara-te-ta';

type SamvatsaraEntry = {
  en: string;
  hi: string;
  sa: string;
};

const SAMVATSARA_CYCLE: SamvatsaraEntry[] = [
  { en: 'Prabhava', hi: 'प्रभव', sa: 'प्रभव' },
  { en: 'Vibhava', hi: 'विभव', sa: 'विभव' },
  { en: 'Shukla', hi: 'शुक्ल', sa: 'शुक्ल' },
  { en: 'Pramoda', hi: 'प्रमोद', sa: 'प्रमोद' },
  { en: 'Prajapati', hi: 'प्रजापति', sa: 'प्रजापति' },
  { en: 'Angirasa', hi: 'अंगिरस', sa: 'अङ्गिरस' },
  { en: 'Shrimukha', hi: 'श्रीमुख', sa: 'श्रीमुख' },
  { en: 'Bhava', hi: 'भव', sa: 'भव' },
  { en: 'Yuva', hi: 'युव', sa: 'युव' },
  { en: 'Dhatri', hi: 'धातृ', sa: 'धातृ' },
  { en: 'Ishvara', hi: 'ईश्वर', sa: 'ईश्वर' },
  { en: 'Bahudhanya', hi: 'बहुधान्य', sa: 'बहुधान्य' },
  { en: 'Pramadi', hi: 'प्रमादि', sa: 'प्रमादि' },
  { en: 'Vikrama', hi: 'विक्रम', sa: 'विक्रम' },
  { en: 'Vrisha', hi: 'वृष', sa: 'वृष' },
  { en: 'Chitrabhanu', hi: 'चित्रभानु', sa: 'चित्रभानु' },
  { en: 'Svabhanu', hi: 'स्वभानु', sa: 'स्वभानु' },
  { en: 'Tarana', hi: 'तारण', sa: 'तारण' },
  { en: 'Parthiva', hi: 'पार्थिव', sa: 'पार्थिव' },
  { en: 'Vyaya', hi: 'व्यय', sa: 'व्यय' },
  { en: 'Sarvajit', hi: 'सर्वजित', sa: 'सर्वजित' },
  { en: 'Sarvadhari', hi: 'सर्वधारी', sa: 'सर्वधारी' },
  { en: 'Virodhi', hi: 'विरोधि', sa: 'विरोधि' },
  { en: 'Vikrita', hi: 'विकृति', sa: 'विकृति' },
  { en: 'Khara', hi: 'खर', sa: 'खर' },
  { en: 'Nandana', hi: 'नंदन', sa: 'नन्दन' },
  { en: 'Vijaya', hi: 'विजय', sa: 'विजय' },
  { en: 'Jaya', hi: 'जय', sa: 'जय' },
  { en: 'Manmatha', hi: 'मन्मथ', sa: 'मन्मथ' },
  { en: 'Durmukha', hi: 'दुर्मुख', sa: 'दुर्मुख' },
  { en: 'Hemalambi', hi: 'हेमलम्बि', sa: 'हेमलम्बि' },
  { en: 'Vilambi', hi: 'विलम्बि', sa: 'विलम्बि' },
  { en: 'Vikari', hi: 'विकारी', sa: 'विकारी' },
  { en: 'Sharvari', hi: 'शार्वरी', sa: 'शार्वरी' },
  { en: 'Plava', hi: 'प्लव', sa: 'प्लव' },
  { en: 'Shubhakrit', hi: 'शुभकृत', sa: 'शुभकृत' },
  { en: 'Shobhakrit', hi: 'शोभकृत', sa: 'शोभकृत' },
  { en: 'Krodhi', hi: 'क्रोधि', sa: 'क्रोधि' },
  { en: 'Vishvavasu', hi: 'विश्वावसु', sa: 'विश्वावसु' },
  { en: 'Parabhava', hi: 'पराभव', sa: 'पराभव' },
  { en: 'Plavanga', hi: 'प्लवंग', sa: 'प्लवाङ्ग' },
  { en: 'Kilaka', hi: 'कीलक', sa: 'कीलक' },
  { en: 'Saumya', hi: 'सौम्य', sa: 'सौम्य' },
  { en: 'Sadharana', hi: 'साधारण', sa: 'साधारण' },
  { en: 'Virodhikrit', hi: 'विरोधकृत', sa: 'विरोधकृत' },
  { en: 'Paridhavi', hi: 'परिधावी', sa: 'परिधावी' },
  { en: 'Pramadicha', hi: 'प्रमादीच', sa: 'प्रमादीच' },
  { en: 'Ananda', hi: 'आनंद', sa: 'आनन्द' },
  { en: 'Rakshasa', hi: 'राक्षस', sa: 'राक्षस' },
  { en: 'Nala', hi: 'नल', sa: 'नल' },
  { en: 'Pingala', hi: 'पिंगल', sa: 'पिङ्गल' },
  { en: 'Kalayukta', hi: 'कालयुक्त', sa: 'कालयुक्त' },
  { en: 'Siddharthi', hi: 'सिद्धार्थी', sa: 'सिद्धार्थी' },
  { en: 'Raudra', hi: 'रौद्र', sa: 'रौद्र' },
  { en: 'Durmati', hi: 'दुर्मति', sa: 'दुर्मति' },
  { en: 'Dundubhi', hi: 'दुन्दुभि', sa: 'दुन्दुभि' },
  { en: 'Rudhirodgari', hi: 'रुधिरोद्गारी', sa: 'रुधिरोद्गारी' },
  { en: 'Raktakshi', hi: 'रक्ताक्षी', sa: 'रक्ताक्षी' },
  { en: 'Krodhana', hi: 'क्रोधन', sa: 'क्रोधन' },
  { en: 'Kshaya', hi: 'क्षय', sa: 'क्षय' },
];

export function getSamvatsaraName(
  vikramSamvat: number,
  language: AppLanguage,
): string {
  // Align Vikram Samvat with the traditional 60-year cycle (e.g. VS 2083 → Parabhava).
  const index = ((vikramSamvat + 56) % 60 + 60) % 60;
  const entry = SAMVATSARA_CYCLE[index];
  if (language === 'te') {
    return SAMVATSARA_TE[index];
  }
  if (language === 'ta') {
    return SAMVATSARA_TA[index];
  }
  if (language === 'sa') {
    return entry.sa;
  }
  if (language === 'hi') {
    return entry.hi;
  }
  return entry.en;
}

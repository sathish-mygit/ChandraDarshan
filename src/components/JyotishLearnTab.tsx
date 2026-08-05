'use client';

import { useMemo, useState } from 'react';
import { LearnTooltip } from '@/components/LearnTooltip';
import {
  getGlossaryTerm,
  type GlossaryTermId,
} from '@/lib/i18n/glossary';
import { LEARN_ARTICLES } from '@/lib/i18n/jyotish-explanations';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, LearnArticleId } from '@/lib/types';
import { cn } from '@/lib/utils';

const GLOSSARY_TERM_IDS: GlossaryTermId[] = [
  'chandraBalam',
  'tarabala',
  'mahaDasha',
  'antarDasha',
  'pratyantarDasha',
  'sadeSati',
  'hora',
  'abhijitMuhurta',
  'lagna',
  'moonRashi',
  'nakshatra',
  'transit',
  'navamsa',
  'dignity',
  'choghadiya',
  'mangalDosha',
  'gochara',
  'varshaphala',
  'kaalSarp',
  'pitruDosha',
  'rahuKalam',
  'ashtakoot',
  'nadiDosha',
  'bhakootDosha',
];

const ARTICLE_IDS: LearnArticleId[] = [
  'chandraBalamCalc',
  'vimshottariDasha',
  'birthTimeMatters',
  'whatWePredict',
  'transits',
  'navamsa',
  'ashtakootBasics',
];

type JyotishLearnTabProps = {
  language: AppLanguage;
  timeUnknown: boolean;
};

export function JyotishLearnTab({
  language,
  timeUnknown,
}: JyotishLearnTabProps) {
  const [query, setQuery] = useState('');
  const useDevanagari = language === 'hi' || language === 'sa';

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return GLOSSARY_TERM_IDS;
    }
    return GLOSSARY_TERM_IDS.filter((id) => {
      const text = getGlossaryTerm(id, language).toLowerCase();
      return id.toLowerCase().includes(q) || text.includes(q);
    });
  }, [query, language]);

  return (
    <div className="space-y-6">
      {timeUnknown ? (
        <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="text-sm font-medium text-amber-200">
            {t('chartDepthLocked', language)}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {t('chartDepthLockedHint', language)}
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('learnArticles', language)}
        </h3>
        <div className="space-y-3">
          {ARTICLE_IDS.map((id) => {
            const article = LEARN_ARTICLES[id][language];
            return (
              <div
                key={id}
                className="rounded-lg bg-slate-900/40 px-3 py-2.5"
              >
                <h4 className="text-sm font-medium text-amber-100">
                  {article.title}
                </h4>
                <p
                  className={cn(
                    'mt-1 text-xs leading-relaxed text-slate-400',
                    useDevanagari && 'font-devanagari',
                  )}
                >
                  {article.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-card/60 p-5">
        <h3 className="mb-3 text-base font-semibold text-amber-100">
          {t('learnGlossary', language)}
        </h3>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchGlossary', language)}
          className="mb-3 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-amber-50 outline-none focus:border-amber-400/60"
        />
        <div className="space-y-2">
          {filteredTerms.map((termId) => (
            <div
              key={termId}
              className="rounded-lg bg-slate-900/40 px-3 py-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium capitalize text-amber-100">
                  {termId.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <LearnTooltip termId={termId} language={language} />
              </div>
              <p
                className={cn(
                  'mt-1 text-xs leading-relaxed text-slate-400',
                  useDevanagari && 'font-devanagari',
                )}
              >
                {getGlossaryTerm(termId, language)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

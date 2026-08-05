import type {
  AppLanguage,
  BirthProfile,
  KundaliMatchQualityBand,
  KundaliMatchViewModel,
} from '../types';
import {
  buildGunaInsight,
  buildMatchSummaryInsight,
  qualityBandLabel,
} from '../i18n/ashtakoot-explanations';
import { synastryLockedMessage } from '../i18n/synastry-explanations';
import { computeAshtakoot } from './ashtakoot';
import { computeChartSynastry } from './chart-synastry';
import { computeMangalPairing } from './mangal-pairing';
import { computeNatalSnapshot } from './natal';

function qualityBand(total: number): KundaliMatchQualityBand {
  if (total >= 32) return 'excellent';
  if (total >= 24) return 'good';
  if (total >= 18) return 'moderate';
  return 'low';
}

export function computeKundaliMatch(
  self: BirthProfile,
  partner: BirthProfile,
  language: AppLanguage,
): KundaliMatchViewModel {
  const selfNatal = computeNatalSnapshot(self, language);
  const partnerNatal = computeNatalSnapshot(partner, language);
  const raw = computeAshtakoot(selfNatal, partnerNatal);

  const context = {
    selfMoonRashi: selfNatal.moonRashi,
    partnerMoonRashi: partnerNatal.moonRashi,
    selfMoonNakshatra: selfNatal.moonNakshatra,
    partnerMoonNakshatra: partnerNatal.moonNakshatra,
  };

  const band = qualityBand(raw.totalScore);
  const mangalPairing = computeMangalPairing(self, partner, language);
  const synastryResult = computeChartSynastry(self, partner, language);

  return {
    selfName: self.name,
    partnerName: partner.name,
    selfMoonRashi: selfNatal.moonRashi,
    selfMoonNakshatra: selfNatal.moonNakshatra,
    partnerMoonRashi: partnerNatal.moonRashi,
    partnerMoonNakshatra: partnerNatal.moonNakshatra,
    gunas: raw.gunas.map((g) => ({
      id: g.id,
      score: g.score,
      maxScore: g.maxScore,
      dosha: g.dosha,
      insight: buildGunaInsight(
        g.id,
        g.score,
        g.maxScore,
        g.dosha,
        context,
        language,
      ),
    })),
    totalScore: raw.totalScore,
    maxTotal: 36,
    qualityBand: band,
    nadiDosha: raw.nadiDosha,
    bhakootDosha: raw.bhakootDosha,
    mangalPairing,
    synastry: {
      unlocked: synastryResult.unlocked,
      timeRequiredMessage: synastryResult.unlocked
        ? undefined
        : synastryLockedMessage(language),
      insights: synastryResult.insights,
    },
    summaryInsight: buildMatchSummaryInsight(
      raw.totalScore,
      qualityBandLabel(band, language),
      raw.nadiDosha,
      raw.bhakootDosha,
      language,
    ),
  };
}

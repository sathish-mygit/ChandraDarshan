import { computeMangalDosha, computeRashiChart } from 'panchang-ts';
import type {
  AppLanguage,
  BirthProfile,
  MangalPairingNote,
  MangalPairingResult,
} from '../types';
import { buildMangalPairingInsight } from '../i18n/synastry-explanations';
import {
  birthInstantFromProfile,
  geoFromLocation,
  toLibraryLanguage,
} from './utils';

function mangalAfflicted(profile: BirthProfile, language: AppLanguage): boolean {
  if (profile.timeUnknown) {
    return false;
  }
  const birth = birthInstantFromProfile(profile);
  const location = geoFromLocation(profile.birthLocation);
  const d1 = computeRashiChart(birth, location, {
    houseSystem: 'whole-sign',
    language: toLibraryLanguage(language),
  });
  return computeMangalDosha(d1).afflicted;
}

function pairingNote(
  selfAfflicted: boolean,
  partnerAfflicted: boolean,
): MangalPairingNote {
  if (selfAfflicted && partnerAfflicted) return 'both';
  if (!selfAfflicted && !partnerAfflicted) return 'neither';
  if (selfAfflicted) return 'self_only';
  return 'partner_only';
}

export function computeMangalPairing(
  self: BirthProfile,
  partner: BirthProfile,
  language: AppLanguage,
): MangalPairingResult {
  const approximate = self.timeUnknown || partner.timeUnknown;

  const selfAfflicted = approximate ? false : mangalAfflicted(self, language);
  const partnerAfflicted = approximate
    ? false
    : mangalAfflicted(partner, language);

  const note = approximate
    ? 'neither'
    : pairingNote(selfAfflicted, partnerAfflicted);

  return {
    selfAfflicted,
    partnerAfflicted,
    pairingNote: note,
    approximate,
    insight: buildMangalPairingInsight(
      selfAfflicted,
      partnerAfflicted,
      note,
      approximate,
      language,
    ),
  };
}

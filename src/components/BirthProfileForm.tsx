'use client';

import { useState } from 'react';
import { CityPicker } from '@/components/CityPicker';
import { CITIES, cityToLocation } from '@/lib/cities';
import { t } from '@/lib/i18n/labels';
import type { AppLanguage, BirthProfile, StoredLocation } from '@/lib/types';

type BirthProfileFormProps = {
  language: AppLanguage;
  initial?: BirthProfile;
  onSave: (profile: BirthProfile) => void;
  onClear?: () => void;
  variant?: 'self' | 'partner';
};

export function BirthProfileForm({
  language,
  initial,
  onSave,
  onClear,
  variant = 'self',
}: BirthProfileFormProps) {
  const defaultLocation =
    initial?.birthLocation ?? cityToLocation(CITIES[0]);

  const [name, setName] = useState(initial?.name ?? '');
  const [birthDate, setBirthDate] = useState(
    initial?.birthDate ?? '1990-01-01',
  );
  const [birthTime, setBirthTime] = useState(initial?.birthTime ?? '12:00');
  const [timeUnknown, setTimeUnknown] = useState(initial?.timeUnknown ?? false);
  const [birthLocation, setBirthLocation] =
    useState<StoredLocation>(defaultLocation);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave({
      name: name.trim() || undefined,
      birthDate,
      birthTime: timeUnknown ? undefined : birthTime,
      timeUnknown,
      birthLocation,
    });
  }

  const nameLabel =
    variant === 'partner' ? t('partnerName', language) : t('userName', language);
  const saveLabel =
    variant === 'partner'
      ? t('savePartnerProfile', language)
      : t('saveProfile', language);
  const clearLabel =
    variant === 'partner'
      ? t('clearPartnerProfile', language)
      : t('clearProfile', language);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-400">{nameLabel}</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-amber-400/60"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400">
          {t('birthDate', language)}
        </label>
        <input
          type="date"
          required
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-amber-400/60"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400">
          {t('birthTime', language)}
        </label>

        {timeUnknown ? (
          <div className="mt-1 flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-3 py-2.5">
            <span className="text-sm text-slate-400">
              {t('timeNotSpecified', language)}
            </span>
            <button
              type="button"
              onClick={() => setTimeUnknown(false)}
              className="shrink-0 text-sm text-amber-400 hover:text-amber-300"
            >
              {t('addBirthTime', language)}
            </button>
          </div>
        ) : (
          <>
            <input
              type="time"
              required
              value={birthTime}
              onChange={(event) => setBirthTime(event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-amber-400/60"
            />
            <button
              type="button"
              onClick={() => setTimeUnknown(true)}
              className="mt-2 text-xs text-slate-500 transition hover:text-amber-400"
            >
              {t('timeUnknown', language)}
            </button>
          </>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-400">
          {t('birthPlace', language)}
        </label>
        <div className="mt-1">
          <CityPicker value={birthLocation} onChange={setBirthLocation} />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl border border-amber-500/40 bg-amber-500/15 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-500/25"
      >
        {saveLabel}
      </button>

      {onClear && initial ? (
        <button
          type="button"
          onClick={onClear}
          className="w-full text-sm text-slate-500 hover:text-slate-300"
        >
          {clearLabel}
        </button>
      ) : null}
    </form>
  );
}

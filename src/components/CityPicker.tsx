'use client';

import { CITIES, cityToLocation } from '@/lib/cities';
import type { StoredLocation } from '@/lib/types';

type CityPickerProps = {
  value: StoredLocation;
  onChange: (location: StoredLocation) => void;
};

export function CityPicker({ value, onChange }: CityPickerProps) {
  const selectedId =
    CITIES.find(
      (city) =>
        city.latitude === value.latitude &&
        city.longitude === value.longitude &&
        (value.source === 'city' || value.source === 'approx'),
    )?.id ?? '';

  return (
    <select
      value={selectedId}
      onChange={(event) => {
        const city = CITIES.find((entry) => entry.id === event.target.value);
        if (city) {
          onChange(cityToLocation(city));
        }
      }}
      className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2.5 text-sm text-amber-50 outline-none focus:border-amber-400/60"
    >
      <option value="" disabled>
        Select a city
      </option>
      {CITIES.map((city) => (
        <option key={city.id} value={city.id}>
          {city.label}
        </option>
      ))}
    </select>
  );
}

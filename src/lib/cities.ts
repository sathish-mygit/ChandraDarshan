import type { CityEntry, StoredLocation } from './types';

export const CITIES: CityEntry[] = [
  {
    id: 'delhi',
    label: 'New Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 330,
  },
  {
    id: 'mumbai',
    label: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 330,
  },
  {
    id: 'bengaluru',
    label: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 330,
  },
  {
    id: 'chennai',
    label: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 330,
  },
  {
    id: 'kolkata',
    label: 'Kolkata',
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: 330,
  },
  {
    id: 'hyderabad',
    label: 'Hyderabad',
    latitude: 17.385,
    longitude: 78.4867,
    timezone: 330,
  },
  {
    id: 'pune',
    label: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    timezone: 330,
  },
  {
    id: 'ahmedabad',
    label: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
    timezone: 330,
  },
  {
    id: 'jaipur',
    label: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.7873,
    timezone: 330,
  },
  {
    id: 'lucknow',
    label: 'Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    timezone: 330,
  },
  {
    id: 'varanasi',
    label: 'Varanasi',
    latitude: 25.3176,
    longitude: 82.9739,
    timezone: 330,
  },
  {
    id: 'ujjain',
    label: 'Ujjain',
    latitude: 23.1765,
    longitude: 75.7885,
    timezone: 330,
  },
];

export const DEFAULT_CITY = CITIES[0];

export function cityToLocation(city: CityEntry): StoredLocation {
  return {
    source: 'city',
    label: city.label,
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
  };
}

export function getCityById(id: string): CityEntry | undefined {
  return CITIES.find((city) => city.id === id);
}

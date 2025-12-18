// Geocoding provider configuration
// By default we fallback to Nominatim (OpenStreetMap) which requires no API key for light use.
// To use a commercial provider, set VITE_GEOCODE_PROVIDER and VITE_GEOCODE_KEY in your environment (.env).

export const GEOCODE_PROVIDER = import.meta.env.VITE_GEOCODE_PROVIDER || 'NOMINATIM';
export const GEOCODE_KEY = import.meta.env.VITE_GEOCODE_KEY || '';

// Supported providers: 'NOMINATIM', 'OPENCAGE' (example). Add more as needed.

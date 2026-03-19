const EARTH_RADIUS_KM = 6371;
const KM_TO_MILES = 0.621371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export interface DistanceResult {
  km: number;
  miles: number;
  bearing: number;
}

/**
 * Calculate the great-circle distance between two points using the Haversine formula.
 */
export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate the initial bearing from point 1 to point 2 in degrees (0-360).
 */
export function bearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLng = toRadians(lng2 - lng1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  const bearingRad = Math.atan2(y, x);
  return ((toDegrees(bearingRad) % 360) + 360) % 360;
}

/**
 * Calculate distance and bearing between two coordinate points.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): DistanceResult {
  const km = haversine(lat1, lng1, lat2, lng2);
  return {
    km,
    miles: km * KM_TO_MILES,
    bearing: bearing(lat1, lng1, lat2, lng2),
  };
}

/**
 * Get compass direction from bearing degrees.
 */
export function bearingToCompass(deg: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

/**
 * Validate latitude value.
 */
export function isValidLatitude(lat: number): boolean {
  return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validate longitude value.
 */
export function isValidLongitude(lng: number): boolean {
  return !Number.isNaN(lng) && lng >= -180 && lng <= 180;
}

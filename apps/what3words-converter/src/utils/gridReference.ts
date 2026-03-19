export interface GridCell {
  id: string;
  row: number;
  col: number;
  centerLat: number;
  centerLng: number;
  resolution: number;
}

export interface Resolution {
  label: string;
  degrees: number;
  description: string;
}

export const RESOLUTIONS: Resolution[] = [
  { label: '1 degree', degrees: 1, description: 'Approx. 111 km at equator' },
  { label: '0.1 degree', degrees: 0.1, description: 'Approx. 11.1 km at equator' },
  { label: '0.01 degree', degrees: 0.01, description: 'Approx. 1.11 km at equator' },
  { label: '0.001 degree', degrees: 0.001, description: 'Approx. 111 m at equator' },
];

/**
 * Convert latitude and longitude to a grid cell reference.
 * The grid divides the world into cells of `resolution` degrees.
 * Cell ID format: "R{row}C{col}" where row/col are zero-indexed from bottom-left (-90, -180).
 */
export function latLngToGridCell(
  lat: number,
  lng: number,
  resolutionDegrees: number,
): GridCell {
  if (lat < -90 || lat > 90) throw new Error('Latitude must be between -90 and 90');
  if (lng < -180 || lng > 180) throw new Error('Longitude must be between -180 and 180');
  if (resolutionDegrees <= 0) throw new Error('Resolution must be positive');

  const row = Math.floor((lat + 90) / resolutionDegrees);
  const col = Math.floor((lng + 180) / resolutionDegrees);

  const centerLat = -90 + (row + 0.5) * resolutionDegrees;
  const centerLng = -180 + (col + 0.5) * resolutionDegrees;

  return {
    id: `R${row}C${col}`,
    row,
    col,
    centerLat: Math.round(centerLat * 1e6) / 1e6,
    centerLng: Math.round(centerLng * 1e6) / 1e6,
    resolution: resolutionDegrees,
  };
}

/**
 * Convert a grid cell ID back to center lat/lng.
 */
export function gridCellToLatLng(
  cellId: string,
  resolutionDegrees: number,
): { lat: number; lng: number } {
  const match = cellId.trim().match(/^R(\d+)C(\d+)$/i);
  if (!match) throw new Error('Invalid cell ID format. Expected "R{row}C{col}"');

  const row = parseInt(match[1], 10);
  const col = parseInt(match[2], 10);

  const maxRow = Math.ceil(180 / resolutionDegrees);
  const maxCol = Math.ceil(360 / resolutionDegrees);

  if (row < 0 || row >= maxRow) throw new Error(`Row must be 0-${maxRow - 1}`);
  if (col < 0 || col >= maxCol) throw new Error(`Col must be 0-${maxCol - 1}`);

  const lat = -90 + (row + 0.5) * resolutionDegrees;
  const lng = -180 + (col + 0.5) * resolutionDegrees;

  return {
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
  };
}

/**
 * Calculate approximate cell size in meters at a given latitude.
 */
export function cellSizeAtLatitude(
  lat: number,
  resolutionDegrees: number,
): { widthKm: number; heightKm: number } {
  const latRadians = (lat * Math.PI) / 180;
  const kmPerDegreeLat = 111.32;
  const kmPerDegreeLng = 111.32 * Math.cos(latRadians);

  return {
    widthKm: Math.round(kmPerDegreeLng * resolutionDegrees * 1000) / 1000,
    heightKm: Math.round(kmPerDegreeLat * resolutionDegrees * 1000) / 1000,
  };
}

/**
 * Get total number of cells at a given resolution.
 */
export function totalCells(resolutionDegrees: number): number {
  const rows = Math.ceil(180 / resolutionDegrees);
  const cols = Math.ceil(360 / resolutionDegrees);
  return rows * cols;
}

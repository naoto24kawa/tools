export interface ProjectionConfig {
  width: number;
  height: number;
  padding: number;
}

export interface BBox {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export type GeoJSONGeometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'MultiPoint'; coordinates: [number, number][] }
  | { type: 'LineString'; coordinates: [number, number][] }
  | { type: 'MultiLineString'; coordinates: [number, number][][] }
  | { type: 'Polygon'; coordinates: [number, number][][] }
  | { type: 'MultiPolygon'; coordinates: [number, number][][][] };

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry;
  properties: Record<string, unknown> | null;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type GeoJSON = GeoJSONFeature | GeoJSONFeatureCollection | GeoJSONGeometry;

const TYPE_COLORS: Record<string, string> = {
  Point: '#ef4444',
  MultiPoint: '#ef4444',
  LineString: '#3b82f6',
  MultiLineString: '#3b82f6',
  Polygon: '#22c55e',
  MultiPolygon: '#22c55e',
};

/**
 * Parse a GeoJSON string.
 */
export function parseGeoJSON(str: string): GeoJSON {
  const parsed = JSON.parse(str);
  if (!parsed.type) throw new Error('Invalid GeoJSON: missing "type"');
  return parsed as GeoJSON;
}

/**
 * Normalize any GeoJSON input to a FeatureCollection.
 */
export function toFeatureCollection(geojson: GeoJSON): GeoJSONFeatureCollection {
  if (geojson.type === 'FeatureCollection') {
    return geojson as GeoJSONFeatureCollection;
  }
  if (geojson.type === 'Feature') {
    return { type: 'FeatureCollection', features: [geojson as GeoJSONFeature] };
  }
  // Raw geometry
  return {
    type: 'FeatureCollection',
    features: [{ type: 'Feature', geometry: geojson as GeoJSONGeometry, properties: {} }],
  };
}

/**
 * Extract all coordinates from a geometry.
 */
export function extractCoordinates(geometry: GeoJSONGeometry): [number, number][] {
  switch (geometry.type) {
    case 'Point':
      return [geometry.coordinates];
    case 'MultiPoint':
    case 'LineString':
      return geometry.coordinates;
    case 'MultiLineString':
    case 'Polygon':
      return geometry.coordinates.flat();
    case 'MultiPolygon':
      return geometry.coordinates.flat(2);
    default:
      return [];
  }
}

/**
 * Calculate the bounding box of a feature collection.
 */
export function calculateBBox(fc: GeoJSONFeatureCollection): BBox {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const feature of fc.features) {
    for (const [lng, lat] of extractCoordinates(feature.geometry)) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }

  // Add small padding if bbox is a point
  if (minLng === maxLng) { minLng -= 1; maxLng += 1; }
  if (minLat === maxLat) { minLat -= 1; maxLat += 1; }

  return { minLng, maxLng, minLat, maxLat };
}

/**
 * Project a lng/lat coordinate to canvas x/y using equirectangular projection.
 */
export function project(
  lng: number,
  lat: number,
  bbox: BBox,
  config: ProjectionConfig,
): [number, number] {
  const drawWidth = config.width - 2 * config.padding;
  const drawHeight = config.height - 2 * config.padding;
  const x = config.padding + ((lng - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * drawWidth;
  // Flip y axis (lat increases upward, canvas y increases downward)
  const y = config.padding + ((bbox.maxLat - lat) / (bbox.maxLat - bbox.minLat)) * drawHeight;
  return [x, y];
}

/**
 * Render a feature collection onto a canvas 2D context.
 */
export function render(
  ctx: CanvasRenderingContext2D,
  fc: GeoJSONFeatureCollection,
  config: ProjectionConfig,
): void {
  const bbox = calculateBBox(fc);

  // Clear
  ctx.clearRect(0, 0, config.width, config.height);

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, config.width, config.height);

  // Draw grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) {
    const x = config.padding + (i / 10) * (config.width - 2 * config.padding);
    const y = config.padding + (i / 10) * (config.height - 2 * config.padding);
    ctx.beginPath();
    ctx.moveTo(x, config.padding);
    ctx.lineTo(x, config.height - config.padding);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(config.padding, y);
    ctx.lineTo(config.width - config.padding, y);
    ctx.stroke();
  }

  // Draw features
  for (const feature of fc.features) {
    const color = TYPE_COLORS[feature.geometry.type] || '#6366f1';
    drawGeometry(ctx, feature.geometry, bbox, config, color);
  }
}

function drawGeometry(
  ctx: CanvasRenderingContext2D,
  geometry: GeoJSONGeometry,
  bbox: BBox,
  config: ProjectionConfig,
  color: string,
): void {
  switch (geometry.type) {
    case 'Point':
      drawPoint(ctx, geometry.coordinates, bbox, config, color);
      break;
    case 'MultiPoint':
      for (const coord of geometry.coordinates) {
        drawPoint(ctx, coord, bbox, config, color);
      }
      break;
    case 'LineString':
      drawLine(ctx, geometry.coordinates, bbox, config, color);
      break;
    case 'MultiLineString':
      for (const line of geometry.coordinates) {
        drawLine(ctx, line, bbox, config, color);
      }
      break;
    case 'Polygon':
      drawPolygon(ctx, geometry.coordinates, bbox, config, color);
      break;
    case 'MultiPolygon':
      for (const polygon of geometry.coordinates) {
        drawPolygon(ctx, polygon, bbox, config, color);
      }
      break;
  }
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  coord: [number, number],
  bbox: BBox,
  config: ProjectionConfig,
  color: string,
): void {
  const [x, y] = project(coord[0], coord[1], bbox, config);
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  coords: [number, number][],
  bbox: BBox,
  config: ProjectionConfig,
  color: string,
): void {
  if (coords.length < 2) return;
  ctx.beginPath();
  const [sx, sy] = project(coords[0][0], coords[0][1], bbox, config);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < coords.length; i++) {
    const [x, y] = project(coords[i][0], coords[i][1], bbox, config);
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  rings: [number, number][][],
  bbox: BBox,
  config: ProjectionConfig,
  color: string,
): void {
  if (rings.length === 0 || rings[0].length < 3) return;
  ctx.beginPath();
  const outer = rings[0];
  const [sx, sy] = project(outer[0][0], outer[0][1], bbox, config);
  ctx.moveTo(sx, sy);
  for (let i = 1; i < outer.length; i++) {
    const [x, y] = project(outer[i][0], outer[i][1], bbox, config);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color + '33';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Find a feature near a canvas point.
 */
export function findFeatureAtPoint(
  x: number,
  y: number,
  fc: GeoJSONFeatureCollection,
  bbox: BBox,
  config: ProjectionConfig,
  threshold: number = 10,
): GeoJSONFeature | null {
  for (const feature of fc.features) {
    const coords = extractCoordinates(feature.geometry);
    for (const [lng, lat] of coords) {
      const [px, py] = project(lng, lat, bbox, config);
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= threshold) return feature;
    }
  }
  return null;
}

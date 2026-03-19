import { describe, it, expect } from 'vitest';
import {
  parseGeoJSON,
  toFeatureCollection,
  extractCoordinates,
  calculateBBox,
  project,
} from '../geojsonRenderer';

describe('parseGeoJSON', () => {
  it('should parse a valid FeatureCollection', () => {
    const json = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: {},
        },
      ],
    });
    const result = parseGeoJSON(json);
    expect(result.type).toBe('FeatureCollection');
  });

  it('should throw on invalid JSON', () => {
    expect(() => parseGeoJSON('{')).toThrow();
  });

  it('should throw on missing type', () => {
    expect(() => parseGeoJSON('{"foo":"bar"}')).toThrow('Invalid GeoJSON');
  });
});

describe('toFeatureCollection', () => {
  it('should wrap a Feature in a FeatureCollection', () => {
    const feature = {
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [1, 2] as [number, number] },
      properties: {},
    };
    const fc = toFeatureCollection(feature);
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features).toHaveLength(1);
  });

  it('should wrap a raw geometry', () => {
    const geom = { type: 'Point' as const, coordinates: [1, 2] as [number, number] };
    const fc = toFeatureCollection(geom);
    expect(fc.type).toBe('FeatureCollection');
    expect(fc.features[0].geometry.type).toBe('Point');
  });
});

describe('extractCoordinates', () => {
  it('should extract Point coordinates', () => {
    const coords = extractCoordinates({ type: 'Point', coordinates: [1, 2] });
    expect(coords).toEqual([[1, 2]]);
  });

  it('should extract LineString coordinates', () => {
    const coords = extractCoordinates({
      type: 'LineString',
      coordinates: [[0, 0], [1, 1]],
    });
    expect(coords).toHaveLength(2);
  });

  it('should extract Polygon coordinates', () => {
    const coords = extractCoordinates({
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
    });
    expect(coords).toHaveLength(5);
  });
});

describe('calculateBBox', () => {
  it('should calculate bounding box', () => {
    const fc = toFeatureCollection({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [10, 10]],
      },
      properties: {},
    });
    const bbox = calculateBBox(fc);
    expect(bbox.minLng).toBe(0);
    expect(bbox.maxLng).toBe(10);
    expect(bbox.minLat).toBe(0);
    expect(bbox.maxLat).toBe(10);
  });
});

describe('project', () => {
  it('should project to canvas coordinates', () => {
    const bbox = { minLng: 0, maxLng: 10, minLat: 0, maxLat: 10 };
    const config = { width: 500, height: 500, padding: 50 };

    const [x, y] = project(0, 10, bbox, config);
    expect(x).toBe(50); // left edge + padding
    expect(y).toBe(50); // top edge + padding (max lat is at top)

    const [x2, y2] = project(10, 0, bbox, config);
    expect(x2).toBe(450); // right edge - padding
    expect(y2).toBe(450); // bottom edge - padding
  });
});

import { describe, it, expect } from 'vitest';
import {
  latLngToGridCell,
  gridCellToLatLng,
  cellSizeAtLatitude,
  totalCells,
} from '../gridReference';

describe('latLngToGridCell', () => {
  it('should convert (0, 0) at 1-degree resolution', () => {
    const cell = latLngToGridCell(0, 0, 1);
    expect(cell.row).toBe(90);
    expect(cell.col).toBe(180);
    expect(cell.id).toBe('R90C180');
    expect(cell.centerLat).toBeCloseTo(0.5, 1);
    expect(cell.centerLng).toBeCloseTo(0.5, 1);
  });

  it('should convert (-90, -180) at 1-degree resolution', () => {
    const cell = latLngToGridCell(-90, -180, 1);
    expect(cell.row).toBe(0);
    expect(cell.col).toBe(0);
    expect(cell.id).toBe('R0C0');
  });

  it('should convert Tokyo coordinates at 0.1 degree', () => {
    const cell = latLngToGridCell(35.6895, 139.6917, 0.1);
    expect(cell.id).toMatch(/^R\d+C\d+$/);
    expect(cell.centerLat).toBeCloseTo(35.65, 0);
    expect(cell.centerLng).toBeCloseTo(139.65, 0);
  });

  it('should throw on invalid latitude', () => {
    expect(() => latLngToGridCell(91, 0, 1)).toThrow();
  });

  it('should throw on invalid longitude', () => {
    expect(() => latLngToGridCell(0, 181, 1)).toThrow();
  });
});

describe('gridCellToLatLng', () => {
  it('should convert R90C180 at 1-degree resolution', () => {
    const result = gridCellToLatLng('R90C180', 1);
    expect(result.lat).toBeCloseTo(0.5, 1);
    expect(result.lng).toBeCloseTo(0.5, 1);
  });

  it('should be inverse of latLngToGridCell', () => {
    const cell = latLngToGridCell(35.6895, 139.6917, 0.1);
    const result = gridCellToLatLng(cell.id, 0.1);
    expect(result.lat).toBeCloseTo(cell.centerLat, 4);
    expect(result.lng).toBeCloseTo(cell.centerLng, 4);
  });

  it('should throw on invalid format', () => {
    expect(() => gridCellToLatLng('invalid', 1)).toThrow();
  });
});

describe('cellSizeAtLatitude', () => {
  it('should calculate cell size at equator', () => {
    const size = cellSizeAtLatitude(0, 1);
    expect(size.heightKm).toBeCloseTo(111.32, 0);
    expect(size.widthKm).toBeCloseTo(111.32, 0);
  });

  it('should have smaller width at higher latitudes', () => {
    const equator = cellSizeAtLatitude(0, 1);
    const lat60 = cellSizeAtLatitude(60, 1);
    expect(lat60.widthKm).toBeLessThan(equator.widthKm);
    expect(lat60.heightKm).toBeCloseTo(equator.heightKm, 0);
  });
});

describe('totalCells', () => {
  it('should calculate total cells at 1-degree resolution', () => {
    expect(totalCells(1)).toBe(180 * 360);
  });

  it('should calculate total cells at 0.1-degree resolution', () => {
    expect(totalCells(0.1)).toBe(1800 * 3600);
  });
});

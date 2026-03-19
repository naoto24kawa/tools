import { describe, expect, it } from 'vitest';
import { generateDockerfile, BASE_IMAGES } from '../dockerfileGenerator';

describe('generateDockerfile', () => {
  it('generates basic node Dockerfile', () => {
    const result = generateDockerfile({
      baseImage: 'node',
      port: 3000,
      multiStage: false,
      nonRootUser: false,
      healthcheck: false,
    });
    expect(result).toContain('FROM node:20-alpine');
    expect(result).toContain('WORKDIR /app');
    expect(result).toContain('COPY package*.json .');
    expect(result).toContain('EXPOSE 3000');
    expect(result).toContain('CMD ["node","dist/index.js"]');
  });

  it('generates multi-stage node Dockerfile', () => {
    const result = generateDockerfile({
      baseImage: 'node',
      port: 3000,
      multiStage: true,
      nonRootUser: false,
      healthcheck: false,
    });
    expect(result).toContain('FROM node:20-alpine AS builder');
    expect(result).toContain('# Production stage');
    expect(result).toContain('COPY --from=builder');
  });

  it('adds non-root user', () => {
    const result = generateDockerfile({
      baseImage: 'python',
      port: 8000,
      multiStage: false,
      nonRootUser: true,
      healthcheck: false,
    });
    expect(result).toContain('adduser');
    expect(result).toContain('USER appuser');
  });

  it('adds healthcheck', () => {
    const result = generateDockerfile({
      baseImage: 'node',
      port: 3000,
      multiStage: false,
      nonRootUser: false,
      healthcheck: true,
    });
    expect(result).toContain('HEALTHCHECK');
    expect(result).toContain('http://localhost:3000/');
  });

  it('uses custom tag', () => {
    const result = generateDockerfile({
      baseImage: 'node',
      tag: '18-slim',
      port: 3000,
      multiStage: false,
      nonRootUser: false,
      healthcheck: false,
    });
    expect(result).toContain('FROM node:18-slim');
  });

  it('uses custom cmd', () => {
    const result = generateDockerfile({
      baseImage: 'node',
      port: 3000,
      multiStage: false,
      nonRootUser: false,
      healthcheck: false,
      cmd: 'npm start',
    });
    expect(result).toContain('CMD ["npm","start"]');
  });

  it('returns empty string for unknown base image', () => {
    const result = generateDockerfile({
      baseImage: 'unknown',
      port: 3000,
      multiStage: false,
      nonRootUser: false,
      healthcheck: false,
    });
    expect(result).toBe('');
  });

  it('generates go multi-stage with alpine', () => {
    const result = generateDockerfile({
      baseImage: 'golang',
      port: 8080,
      multiStage: true,
      nonRootUser: false,
      healthcheck: false,
    });
    expect(result).toContain('FROM golang:1.22-alpine AS builder');
    expect(result).toContain('FROM alpine:3.19');
    expect(result).toContain('ca-certificates');
  });
});

describe('BASE_IMAGES', () => {
  it('has at least 8 base images', () => {
    expect(BASE_IMAGES.length).toBeGreaterThanOrEqual(8);
  });

  it('each image has required fields', () => {
    BASE_IMAGES.forEach((img) => {
      expect(img.name).toBeTruthy();
      expect(img.label).toBeTruthy();
      expect(img.defaultTag).toBeTruthy();
      expect(img.workdir).toBeTruthy();
    });
  });
});

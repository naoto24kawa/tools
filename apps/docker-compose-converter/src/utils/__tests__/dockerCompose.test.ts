import { describe, expect, test } from 'vitest';
import { convertDockerRunToCompose, parseDockerRun } from '../dockerCompose';

describe('dockerCompose', () => {
  test('parses simple docker run', () => {
    const result = parseDockerRun('docker run -d -p 8080:80 nginx');
    expect(result.image).toBe('nginx');
    expect(result.ports).toEqual(['8080:80']);
    expect(result.detach).toBe(true);
  });

  test('parses name and env', () => {
    const result = parseDockerRun('docker run --name myapp -e NODE_ENV=production node');
    expect(result.name).toBe('myapp');
    expect(result.envVars).toEqual(['NODE_ENV=production']);
  });

  test('converts to compose yaml', () => {
    const result = convertDockerRunToCompose(
      'docker run -d --name web -p 80:80 -v /data:/data nginx'
    );
    expect(result).toContain('image: nginx');
    expect(result).toContain('- "80:80"');
    expect(result).toContain('- "/data:/data"');
  });

  test('handles restart policy', () => {
    const result = convertDockerRunToCompose('docker run --restart always nginx');
    expect(result).toContain('restart: always');
  });
});

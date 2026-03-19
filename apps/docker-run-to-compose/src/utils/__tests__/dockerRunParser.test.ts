import { describe, it, expect } from 'vitest';
import { parseDockerRun, toComposeYaml } from '../dockerRunParser';

describe('parseDockerRun', () => {
  it('parses basic docker run', () => {
    const result = parseDockerRun('docker run nginx');
    expect(result.service.image).toBe('nginx');
    expect(result.warnings).toHaveLength(0);
  });

  it('parses container name', () => {
    const result = parseDockerRun('docker run --name my-app nginx');
    expect(result.service.container_name).toBe('my-app');
    expect(result.serviceName).toBe('my-app');
  });

  it('parses ports', () => {
    const result = parseDockerRun('docker run -p 8080:80 -p 443:443 nginx');
    expect(result.service.ports).toEqual(['8080:80', '443:443']);
  });

  it('parses volumes', () => {
    const result = parseDockerRun('docker run -v /host:/container nginx');
    expect(result.service.volumes).toEqual(['/host:/container']);
  });

  it('parses environment variables', () => {
    const result = parseDockerRun('docker run -e FOO=bar -e BAZ=qux nginx');
    expect(result.service.environment).toEqual(['FOO=bar', 'BAZ=qux']);
  });

  it('parses --env= format', () => {
    const result = parseDockerRun('docker run --env=FOO=bar nginx');
    expect(result.service.environment).toEqual(['FOO=bar']);
  });

  it('parses restart policy', () => {
    const result = parseDockerRun('docker run --restart always nginx');
    expect(result.service.restart).toBe('always');
  });

  it('parses restart= format', () => {
    const result = parseDockerRun('docker run --restart=unless-stopped nginx');
    expect(result.service.restart).toBe('unless-stopped');
  });

  it('parses network', () => {
    const result = parseDockerRun('docker run --network my-net nginx');
    expect(result.service.networks).toEqual(['my-net']);
  });

  it('parses interactive and tty flags', () => {
    const result = parseDockerRun('docker run -it ubuntu bash');
    expect(result.service.stdin_open).toBe(true);
    expect(result.service.tty).toBe(true);
    expect(result.service.command).toBe('bash');
  });

  it('parses privileged flag', () => {
    const result = parseDockerRun('docker run --privileged nginx');
    expect(result.service.privileged).toBe(true);
  });

  it('parses command after image', () => {
    const result = parseDockerRun('docker run nginx nginx -g daemon off');
    expect(result.service.image).toBe('nginx');
    expect(result.service.command).toBe('nginx -g daemon off');
  });

  it('handles line continuations', () => {
    const result = parseDockerRun('docker run \\\n  -p 80:80 \\\n  nginx');
    expect(result.service.ports).toEqual(['80:80']);
    expect(result.service.image).toBe('nginx');
  });

  it('warns on missing image', () => {
    const result = parseDockerRun('docker run -p 80:80');
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('toComposeYaml', () => {
  it('generates valid compose yaml', () => {
    const result = parseDockerRun('docker run --name web -p 8080:80 -v ./data:/data -e NODE_ENV=production --restart always nginx');
    const yaml = toComposeYaml(result);

    expect(yaml).toContain('version: "3.8"');
    expect(yaml).toContain('services:');
    expect(yaml).toContain('image: nginx');
    expect(yaml).toContain('container_name: web');
    expect(yaml).toContain('"8080:80"');
    expect(yaml).toContain('./data:/data');
    expect(yaml).toContain('NODE_ENV=production');
    expect(yaml).toContain('restart: always');
  });

  it('generates compose yaml for simple case', () => {
    const result = parseDockerRun('docker run nginx');
    const yaml = toComposeYaml(result);
    expect(yaml).toContain('image: nginx');
  });
});

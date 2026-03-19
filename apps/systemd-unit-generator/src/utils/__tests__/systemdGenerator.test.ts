import { describe, it, expect } from 'vitest';
import {
  generateServiceUnit,
  generateTimerUnit,
  defaultServiceConfig,
  defaultTimerConfig,
} from '../systemdGenerator';

describe('generateServiceUnit', () => {
  it('generates valid service unit file', () => {
    const result = generateServiceUnit(defaultServiceConfig);
    expect(result).toContain('[Unit]');
    expect(result).toContain('[Service]');
    expect(result).toContain('[Install]');
    expect(result).toContain('Description=My Application');
    expect(result).toContain('ExecStart=/usr/bin/my-app');
    expect(result).toContain('Type=simple');
    expect(result).toContain('Restart=on-failure');
    expect(result).toContain('WantedBy=multi-user.target');
  });

  it('includes user and group', () => {
    const result = generateServiceUnit(defaultServiceConfig);
    expect(result).toContain('User=www-data');
    expect(result).toContain('Group=www-data');
  });

  it('includes After directive', () => {
    const result = generateServiceUnit(defaultServiceConfig);
    expect(result).toContain('After=network.target');
  });

  it('includes working directory', () => {
    const result = generateServiceUnit(defaultServiceConfig);
    expect(result).toContain('WorkingDirectory=/opt/my-app');
  });

  it('includes environment variables', () => {
    const config = {
      ...defaultServiceConfig,
      environment: [{ key: 'NODE_ENV', value: 'production' }],
    };
    const result = generateServiceUnit(config);
    expect(result).toContain('Environment="NODE_ENV=production"');
  });

  it('includes security options when enabled', () => {
    const config = {
      ...defaultServiceConfig,
      enablePrivateTmp: true,
      enableProtectSystem: true,
      enableSandbox: true,
    };
    const result = generateServiceUnit(config);
    expect(result).toContain('PrivateTmp=true');
    expect(result).toContain('ProtectSystem=full');
    expect(result).toContain('NoNewPrivileges=true');
  });

  it('includes Requires directive', () => {
    const config = { ...defaultServiceConfig, requires: 'postgresql.service' };
    const result = generateServiceUnit(config);
    expect(result).toContain('Requires=postgresql.service');
  });

  it('includes restart sec', () => {
    const result = generateServiceUnit(defaultServiceConfig);
    expect(result).toContain('RestartSec=5');
  });
});

describe('generateTimerUnit', () => {
  it('generates valid timer unit file', () => {
    const result = generateTimerUnit(defaultTimerConfig);
    expect(result).toContain('[Unit]');
    expect(result).toContain('[Timer]');
    expect(result).toContain('[Install]');
    expect(result).toContain('Description=My Timer');
    expect(result).toContain('OnCalendar=*-*-* 00:00:00');
    expect(result).toContain('WantedBy=timers.target');
  });

  it('includes Persistent directive', () => {
    const result = generateTimerUnit(defaultTimerConfig);
    expect(result).toContain('Persistent=true');
  });

  it('includes Unit directive', () => {
    const result = generateTimerUnit(defaultTimerConfig);
    expect(result).toContain('Unit=my-app.service');
  });

  it('includes OnBootSec when set', () => {
    const config = { ...defaultTimerConfig, onBootSec: '5min' };
    const result = generateTimerUnit(config);
    expect(result).toContain('OnBootSec=5min');
  });

  it('includes OnUnitActiveSec when set', () => {
    const config = { ...defaultTimerConfig, onUnitActiveSec: '1h' };
    const result = generateTimerUnit(config);
    expect(result).toContain('OnUnitActiveSec=1h');
  });
});

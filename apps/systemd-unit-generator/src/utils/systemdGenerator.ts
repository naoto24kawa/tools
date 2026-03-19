export type UnitType = 'service' | 'timer';

export interface ServiceConfig {
  description: string;
  type: 'simple' | 'forking' | 'oneshot' | 'notify' | 'idle';
  execStart: string;
  execStartPre: string;
  execStartPost: string;
  execStop: string;
  user: string;
  group: string;
  workingDirectory: string;
  environment: { key: string; value: string }[];
  restart: 'no' | 'always' | 'on-success' | 'on-failure' | 'on-abnormal' | 'on-abort';
  restartSec: string;
  wantedBy: string;
  after: string;
  requires: string;
  wants: string;
  enableSandbox: boolean;
  enablePrivateTmp: boolean;
  enableProtectSystem: boolean;
}

export interface TimerConfig {
  description: string;
  onCalendar: string;
  onBootSec: string;
  onUnitActiveSec: string;
  persistent: boolean;
  unit: string;
  wantedBy: string;
}

export const defaultServiceConfig: ServiceConfig = {
  description: 'My Application',
  type: 'simple',
  execStart: '/usr/bin/my-app',
  execStartPre: '',
  execStartPost: '',
  execStop: '',
  user: 'www-data',
  group: 'www-data',
  workingDirectory: '/opt/my-app',
  environment: [],
  restart: 'on-failure',
  restartSec: '5',
  wantedBy: 'multi-user.target',
  after: 'network.target',
  requires: '',
  wants: '',
  enableSandbox: false,
  enablePrivateTmp: false,
  enableProtectSystem: false,
};

export const defaultTimerConfig: TimerConfig = {
  description: 'My Timer',
  onCalendar: '*-*-* 00:00:00',
  onBootSec: '',
  onUnitActiveSec: '',
  persistent: true,
  unit: 'my-app.service',
  wantedBy: 'timers.target',
};

export function generateServiceUnit(config: ServiceConfig): string {
  const lines: string[] = [];

  // [Unit] section
  lines.push('[Unit]');
  lines.push(`Description=${config.description}`);
  if (config.after) {
    lines.push(`After=${config.after}`);
  }
  if (config.requires) {
    lines.push(`Requires=${config.requires}`);
  }
  if (config.wants) {
    lines.push(`Wants=${config.wants}`);
  }
  lines.push('');

  // [Service] section
  lines.push('[Service]');
  lines.push(`Type=${config.type}`);

  if (config.user) {
    lines.push(`User=${config.user}`);
  }
  if (config.group) {
    lines.push(`Group=${config.group}`);
  }
  if (config.workingDirectory) {
    lines.push(`WorkingDirectory=${config.workingDirectory}`);
  }

  // Environment
  for (const env of config.environment) {
    if (env.key) {
      lines.push(`Environment="${env.key}=${env.value}"`);
    }
  }

  if (config.execStartPre) {
    lines.push(`ExecStartPre=${config.execStartPre}`);
  }
  lines.push(`ExecStart=${config.execStart}`);
  if (config.execStartPost) {
    lines.push(`ExecStartPost=${config.execStartPost}`);
  }
  if (config.execStop) {
    lines.push(`ExecStop=${config.execStop}`);
  }

  lines.push(`Restart=${config.restart}`);
  if (config.restartSec) {
    lines.push(`RestartSec=${config.restartSec}`);
  }

  // Security
  if (config.enablePrivateTmp) {
    lines.push('PrivateTmp=true');
  }
  if (config.enableProtectSystem) {
    lines.push('ProtectSystem=full');
  }
  if (config.enableSandbox) {
    lines.push('NoNewPrivileges=true');
    lines.push('ProtectHome=true');
    lines.push('ReadOnlyDirectories=/');
  }
  lines.push('');

  // [Install] section
  lines.push('[Install]');
  lines.push(`WantedBy=${config.wantedBy}`);

  return lines.join('\n') + '\n';
}

export function generateTimerUnit(config: TimerConfig): string {
  const lines: string[] = [];

  // [Unit] section
  lines.push('[Unit]');
  lines.push(`Description=${config.description}`);
  lines.push('');

  // [Timer] section
  lines.push('[Timer]');
  if (config.onCalendar) {
    lines.push(`OnCalendar=${config.onCalendar}`);
  }
  if (config.onBootSec) {
    lines.push(`OnBootSec=${config.onBootSec}`);
  }
  if (config.onUnitActiveSec) {
    lines.push(`OnUnitActiveSec=${config.onUnitActiveSec}`);
  }
  if (config.persistent) {
    lines.push('Persistent=true');
  }
  if (config.unit) {
    lines.push(`Unit=${config.unit}`);
  }
  lines.push('');

  // [Install] section
  lines.push('[Install]');
  lines.push(`WantedBy=${config.wantedBy}`);

  return lines.join('\n') + '\n';
}

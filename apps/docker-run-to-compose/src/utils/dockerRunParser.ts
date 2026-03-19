export interface DockerComposeService {
  image: string;
  container_name?: string;
  ports?: string[];
  volumes?: string[];
  environment?: string[];
  restart?: string;
  networks?: string[];
  command?: string;
  entrypoint?: string;
  working_dir?: string;
  user?: string;
  privileged?: boolean;
  stdin_open?: boolean;
  tty?: boolean;
  labels?: string[];
  extra_hosts?: string[];
  dns?: string[];
  cap_add?: string[];
  cap_drop?: string[];
  devices?: string[];
  tmpfs?: string[];
  shm_size?: string;
  mem_limit?: string;
  cpus?: string;
}

export interface ParseResult {
  serviceName: string;
  service: DockerComposeService;
  warnings: string[];
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inQuote: string | null = null;
  let escape = false;

  for (const ch of input) {
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inQuote = ch;
      continue;
    }
    if (ch === ' ' || ch === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);
  return tokens;
}

export function parseDockerRun(command: string): ParseResult {
  const warnings: string[] = [];
  const lines = command.replace(/\\\n/g, ' ').replace(/\\\r\n/g, ' ');
  const tokens = tokenize(lines.trim());

  // Skip 'docker' and 'run' tokens
  let i = 0;
  if (tokens[i] === 'docker') i++;
  if (tokens[i] === 'run') i++;

  const service: DockerComposeService = { image: '' };
  let serviceName = 'app';

  while (i < tokens.length) {
    const token = tokens[i];

    if (token === '--name' && tokens[i + 1]) {
      service.container_name = tokens[++i];
      serviceName = service.container_name.replace(/[^a-zA-Z0-9_-]/g, '_');
    } else if ((token === '-p' || token === '--publish') && tokens[i + 1]) {
      if (!service.ports) service.ports = [];
      service.ports.push(tokens[++i]);
    } else if ((token === '-v' || token === '--volume') && tokens[i + 1]) {
      if (!service.volumes) service.volumes = [];
      service.volumes.push(tokens[++i]);
    } else if ((token === '-e' || token === '--env') && tokens[i + 1]) {
      if (!service.environment) service.environment = [];
      service.environment.push(stripQuotes(tokens[++i]));
    } else if (token.startsWith('--env=')) {
      if (!service.environment) service.environment = [];
      service.environment.push(stripQuotes(token.slice(6)));
    } else if (token === '--env-file' && tokens[i + 1]) {
      warnings.push(`--env-file ${tokens[i + 1]} is not directly supported, add env_file manually`);
      i++;
    } else if (token === '--restart' && tokens[i + 1]) {
      service.restart = tokens[++i];
    } else if (token.startsWith('--restart=')) {
      service.restart = token.slice(10);
    } else if (token === '--network' && tokens[i + 1]) {
      if (!service.networks) service.networks = [];
      service.networks.push(tokens[++i]);
    } else if (token.startsWith('--network=')) {
      if (!service.networks) service.networks = [];
      service.networks.push(token.slice(10));
    } else if (token === '--entrypoint' && tokens[i + 1]) {
      service.entrypoint = tokens[++i];
    } else if (token === '-w' || token === '--workdir') {
      if (tokens[i + 1]) service.working_dir = tokens[++i];
    } else if (token === '-u' || token === '--user') {
      if (tokens[i + 1]) service.user = tokens[++i];
    } else if (token === '--privileged') {
      service.privileged = true;
    } else if (token === '-i' || token === '--interactive') {
      service.stdin_open = true;
    } else if (token === '-t' || token === '--tty') {
      service.tty = true;
    } else if (token === '-it' || token === '-ti') {
      service.stdin_open = true;
      service.tty = true;
    } else if ((token === '-l' || token === '--label') && tokens[i + 1]) {
      if (!service.labels) service.labels = [];
      service.labels.push(tokens[++i]);
    } else if (token === '--add-host' && tokens[i + 1]) {
      if (!service.extra_hosts) service.extra_hosts = [];
      service.extra_hosts.push(tokens[++i]);
    } else if (token === '--dns' && tokens[i + 1]) {
      if (!service.dns) service.dns = [];
      service.dns.push(tokens[++i]);
    } else if (token === '--cap-add' && tokens[i + 1]) {
      if (!service.cap_add) service.cap_add = [];
      service.cap_add.push(tokens[++i]);
    } else if (token === '--cap-drop' && tokens[i + 1]) {
      if (!service.cap_drop) service.cap_drop = [];
      service.cap_drop.push(tokens[++i]);
    } else if (token === '--device' && tokens[i + 1]) {
      if (!service.devices) service.devices = [];
      service.devices.push(tokens[++i]);
    } else if (token === '--tmpfs' && tokens[i + 1]) {
      if (!service.tmpfs) service.tmpfs = [];
      service.tmpfs.push(tokens[++i]);
    } else if (token === '--shm-size' && tokens[i + 1]) {
      service.shm_size = tokens[++i];
    } else if (token.startsWith('--shm-size=')) {
      service.shm_size = token.slice(11);
    } else if ((token === '-m' || token === '--memory') && tokens[i + 1]) {
      service.mem_limit = tokens[++i];
    } else if (token === '--cpus' && tokens[i + 1]) {
      service.cpus = tokens[++i];
    } else if (token === '-d' || token === '--detach') {
      // detach mode - no compose equivalent needed
    } else if (token === '--rm') {
      // no compose equivalent
    } else if (token.startsWith('-') && !token.startsWith('--')) {
      // Short flags that might be combined like -dit
      const flags = token.slice(1);
      for (const f of flags) {
        if (f === 'd') continue;
        if (f === 'i') service.stdin_open = true;
        if (f === 't') service.tty = true;
      }
    } else if (!token.startsWith('-') && !service.image) {
      service.image = token;
    } else if (!token.startsWith('-') && service.image) {
      // Everything after image is the command
      const remaining = tokens.slice(i).join(' ');
      service.command = remaining;
      break;
    } else {
      warnings.push(`Unrecognized option: ${token}`);
    }

    i++;
  }

  if (!service.image) {
    warnings.push('No image specified');
    service.image = 'IMAGE_NAME';
  }

  return { serviceName, service, warnings };
}

function indent(text: string, level: number): string {
  return '  '.repeat(level) + text;
}

export function toComposeYaml(result: ParseResult): string {
  const { serviceName, service } = result;
  const lines: string[] = [];

  lines.push('version: "3.8"');
  lines.push('services:');
  lines.push(indent(`${serviceName}:`, 1));
  lines.push(indent(`image: ${service.image}`, 2));

  if (service.container_name) {
    lines.push(indent(`container_name: ${service.container_name}`, 2));
  }

  if (service.restart) {
    lines.push(indent(`restart: ${service.restart}`, 2));
  }

  if (service.ports && service.ports.length > 0) {
    lines.push(indent('ports:', 2));
    for (const p of service.ports) {
      lines.push(indent(`- "${p}"`, 3));
    }
  }

  if (service.volumes && service.volumes.length > 0) {
    lines.push(indent('volumes:', 2));
    for (const v of service.volumes) {
      lines.push(indent(`- ${v}`, 3));
    }
  }

  if (service.environment && service.environment.length > 0) {
    lines.push(indent('environment:', 2));
    for (const e of service.environment) {
      lines.push(indent(`- ${e}`, 3));
    }
  }

  if (service.networks && service.networks.length > 0) {
    lines.push(indent('networks:', 2));
    for (const n of service.networks) {
      lines.push(indent(`- ${n}`, 3));
    }
  }

  if (service.command) {
    lines.push(indent(`command: ${service.command}`, 2));
  }

  if (service.entrypoint) {
    lines.push(indent(`entrypoint: ${service.entrypoint}`, 2));
  }

  if (service.working_dir) {
    lines.push(indent(`working_dir: ${service.working_dir}`, 2));
  }

  if (service.user) {
    lines.push(indent(`user: "${service.user}"`, 2));
  }

  if (service.privileged) {
    lines.push(indent('privileged: true', 2));
  }

  if (service.stdin_open) {
    lines.push(indent('stdin_open: true', 2));
  }

  if (service.tty) {
    lines.push(indent('tty: true', 2));
  }

  if (service.labels && service.labels.length > 0) {
    lines.push(indent('labels:', 2));
    for (const l of service.labels) {
      lines.push(indent(`- ${l}`, 3));
    }
  }

  if (service.extra_hosts && service.extra_hosts.length > 0) {
    lines.push(indent('extra_hosts:', 2));
    for (const h of service.extra_hosts) {
      lines.push(indent(`- ${h}`, 3));
    }
  }

  if (service.dns && service.dns.length > 0) {
    lines.push(indent('dns:', 2));
    for (const d of service.dns) {
      lines.push(indent(`- ${d}`, 3));
    }
  }

  if (service.cap_add && service.cap_add.length > 0) {
    lines.push(indent('cap_add:', 2));
    for (const c of service.cap_add) {
      lines.push(indent(`- ${c}`, 3));
    }
  }

  if (service.cap_drop && service.cap_drop.length > 0) {
    lines.push(indent('cap_drop:', 2));
    for (const c of service.cap_drop) {
      lines.push(indent(`- ${c}`, 3));
    }
  }

  if (service.devices && service.devices.length > 0) {
    lines.push(indent('devices:', 2));
    for (const d of service.devices) {
      lines.push(indent(`- ${d}`, 3));
    }
  }

  if (service.tmpfs && service.tmpfs.length > 0) {
    lines.push(indent('tmpfs:', 2));
    for (const t of service.tmpfs) {
      lines.push(indent(`- ${t}`, 3));
    }
  }

  if (service.shm_size) {
    lines.push(indent(`shm_size: "${service.shm_size}"`, 2));
  }

  if (service.mem_limit) {
    lines.push(indent(`mem_limit: ${service.mem_limit}`, 2));
  }

  if (service.cpus) {
    lines.push(indent(`cpus: ${service.cpus}`, 2));
  }

  // Add networks section if needed
  if (service.networks && service.networks.length > 0) {
    lines.push('');
    lines.push('networks:');
    for (const n of service.networks) {
      if (n !== 'host' && n !== 'none' && n !== 'bridge') {
        lines.push(indent(`${n}:`, 1));
        lines.push(indent('external: true', 2));
      }
    }
  }

  return lines.join('\n') + '\n';
}

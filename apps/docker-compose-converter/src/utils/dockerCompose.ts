interface DockerRunOptions {
  image: string;
  name?: string;
  ports: string[];
  volumes: string[];
  envVars: string[];
  restart?: string;
  network?: string;
  command?: string;
  detach: boolean;
}

type ArgHandler = (result: DockerRunOptions, args: string[], index: number) => number;

const VALUE_FLAGS: Record<string, ArgHandler> = {
  '-p': (r, a, i) => {
    r.ports.push(a[i + 1]);
    return i + 1;
  },
  '--publish': (r, a, i) => {
    r.ports.push(a[i + 1]);
    return i + 1;
  },
  '-v': (r, a, i) => {
    r.volumes.push(a[i + 1]);
    return i + 1;
  },
  '--volume': (r, a, i) => {
    r.volumes.push(a[i + 1]);
    return i + 1;
  },
  '-e': (r, a, i) => {
    r.envVars.push(a[i + 1]);
    return i + 1;
  },
  '--env': (r, a, i) => {
    r.envVars.push(a[i + 1]);
    return i + 1;
  },
  '--name': (r, a, i) => {
    r.name = a[i + 1];
    return i + 1;
  },
  '--restart': (r, a, i) => {
    r.restart = a[i + 1];
    return i + 1;
  },
  '--network': (r, a, i) => {
    r.network = a[i + 1];
    return i + 1;
  },
  '-d': (r, _a, i) => {
    r.detach = true;
    return i;
  },
  '--detach': (r, _a, i) => {
    r.detach = true;
    return i;
  },
};

function handlePositionalArg(result: DockerRunOptions, arg: string): void {
  if (!result.image) {
    result.image = arg;
    return;
  }
  result.command = result.command ? `${result.command} ${arg}` : arg;
}

export function parseDockerRun(command: string): DockerRunOptions {
  const result: DockerRunOptions = {
    image: '',
    ports: [],
    volumes: [],
    envVars: [],
    detach: false,
  };

  const args = tokenize(command.replace(/^docker\s+run\s*/, '').trim());
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    const handler = VALUE_FLAGS[arg];

    if (handler) {
      i = handler(result, args, i);
    } else if (!arg.startsWith('-')) {
      handlePositionalArg(result, arg);
    }
    i++;
  }

  return result;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (const char of input) {
    if (inQuote) {
      if (char === quoteChar) {
        inQuote = false;
      } else {
        current += char;
      }
    } else if (char === '"' || char === "'") {
      inQuote = true;
      quoteChar = char;
    } else if (char === ' ' || char === '\t') {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function toCompose(options: DockerRunOptions): string {
  const lines: string[] = ['version: "3"', 'services:'];
  const name = options.name || 'app';
  lines.push(`  ${name}:`);
  lines.push(`    image: ${options.image}`);

  if (options.ports.length > 0) {
    lines.push('    ports:');
    for (const p of options.ports) lines.push(`      - "${p}"`);
  }
  if (options.volumes.length > 0) {
    lines.push('    volumes:');
    for (const v of options.volumes) lines.push(`      - "${v}"`);
  }
  if (options.envVars.length > 0) {
    lines.push('    environment:');
    for (const e of options.envVars) lines.push(`      - "${e}"`);
  }
  if (options.restart) lines.push(`    restart: ${options.restart}`);
  if (options.network) lines.push(`    networks:\n      - ${options.network}`);
  if (options.command) lines.push(`    command: ${options.command}`);

  if (options.network) {
    lines.push('');
    lines.push('networks:');
    lines.push(`  ${options.network}:`);
  }

  return lines.join('\n');
}

export function convertDockerRunToCompose(command: string): string {
  const options = parseDockerRun(command);
  return toCompose(options);
}

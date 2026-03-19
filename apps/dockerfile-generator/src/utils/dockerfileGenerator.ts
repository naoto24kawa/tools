export interface BaseImage {
  name: string;
  label: string;
  defaultTag: string;
  defaultPort: number;
  defaultCmd: string;
  workdir: string;
  installCmd?: string;
  copyFiles?: string[];
  buildCmd?: string;
  supportsMultiStage: boolean;
}

export const BASE_IMAGES: BaseImage[] = [
  {
    name: 'node',
    label: 'Node.js',
    defaultTag: '20-alpine',
    defaultPort: 3000,
    defaultCmd: 'node dist/index.js',
    workdir: '/app',
    installCmd: 'npm ci --only=production',
    copyFiles: ['package*.json'],
    buildCmd: 'npm run build',
    supportsMultiStage: true,
  },
  {
    name: 'python',
    label: 'Python',
    defaultTag: '3.12-slim',
    defaultPort: 8000,
    defaultCmd: 'python app.py',
    workdir: '/app',
    installCmd: 'pip install --no-cache-dir -r requirements.txt',
    copyFiles: ['requirements.txt'],
    supportsMultiStage: true,
  },
  {
    name: 'golang',
    label: 'Go',
    defaultTag: '1.22-alpine',
    defaultPort: 8080,
    defaultCmd: './main',
    workdir: '/app',
    installCmd: 'go mod download',
    copyFiles: ['go.mod', 'go.sum'],
    buildCmd: 'CGO_ENABLED=0 go build -o main .',
    supportsMultiStage: true,
  },
  {
    name: 'rust',
    label: 'Rust',
    defaultTag: '1.77-slim',
    defaultPort: 8080,
    defaultCmd: './target/release/app',
    workdir: '/app',
    installCmd: 'cargo build --release',
    copyFiles: ['Cargo.toml', 'Cargo.lock'],
    supportsMultiStage: true,
  },
  {
    name: 'eclipse-temurin',
    label: 'Java (Eclipse Temurin)',
    defaultTag: '21-jre-alpine',
    defaultPort: 8080,
    defaultCmd: 'java -jar app.jar',
    workdir: '/app',
    supportsMultiStage: true,
  },
  {
    name: 'ruby',
    label: 'Ruby',
    defaultTag: '3.3-slim',
    defaultPort: 3000,
    defaultCmd: 'ruby app.rb',
    workdir: '/app',
    installCmd: 'bundle install --without development test',
    copyFiles: ['Gemfile', 'Gemfile.lock'],
    supportsMultiStage: false,
  },
  {
    name: 'nginx',
    label: 'Nginx',
    defaultTag: 'alpine',
    defaultPort: 80,
    defaultCmd: '',
    workdir: '/usr/share/nginx/html',
    supportsMultiStage: false,
  },
  {
    name: 'alpine',
    label: 'Alpine Linux',
    defaultTag: '3.19',
    defaultPort: 8080,
    defaultCmd: './app',
    workdir: '/app',
    supportsMultiStage: false,
  },
];

export interface DockerfileOptions {
  baseImage: string;
  tag?: string;
  port: number;
  multiStage: boolean;
  nonRootUser: boolean;
  healthcheck: boolean;
  cmd?: string;
}

export function generateDockerfile(options: DockerfileOptions): string {
  const { baseImage, tag, port, multiStage, nonRootUser, healthcheck, cmd } = options;
  const image = BASE_IMAGES.find((b) => b.name === baseImage);
  if (!image) return '';

  const imageTag = tag || image.defaultTag;
  const command = cmd || image.defaultCmd;
  const lines: string[] = [];

  if (multiStage && image.supportsMultiStage) {
    lines.push(`# Build stage`);
    lines.push(`FROM ${image.name}:${imageTag} AS builder`);
    lines.push('');
    lines.push(`WORKDIR ${image.workdir}`);
    lines.push('');

    if (image.copyFiles) {
      for (const file of image.copyFiles) {
        lines.push(`COPY ${file} .`);
      }
      if (image.installCmd) {
        lines.push(`RUN ${image.installCmd}`);
      }
      lines.push('');
    }

    lines.push('COPY . .');
    if (image.buildCmd) {
      lines.push(`RUN ${image.buildCmd}`);
    }
    lines.push('');

    lines.push('# Production stage');
    if (image.name === 'golang') {
      lines.push('FROM alpine:3.19');
      lines.push('');
      lines.push('RUN apk --no-cache add ca-certificates');
    } else if (image.name === 'rust') {
      lines.push('FROM debian:bookworm-slim');
    } else {
      lines.push(`FROM ${image.name}:${imageTag}`);
    }
    lines.push('');
    lines.push(`WORKDIR ${image.workdir}`);
    lines.push('');

    if (image.name === 'node') {
      lines.push('COPY --from=builder /app/dist ./dist');
      lines.push('COPY --from=builder /app/node_modules ./node_modules');
      lines.push('COPY --from=builder /app/package.json .');
    } else if (image.name === 'golang') {
      lines.push('COPY --from=builder /app/main .');
    } else if (image.name === 'rust') {
      lines.push('COPY --from=builder /app/target/release/app .');
    } else if (image.name === 'python') {
      lines.push('COPY --from=builder /app .');
    } else {
      lines.push('COPY --from=builder /app .');
    }
    lines.push('');
  } else {
    lines.push(`FROM ${image.name}:${imageTag}`);
    lines.push('');
    lines.push(`WORKDIR ${image.workdir}`);
    lines.push('');

    if (image.copyFiles) {
      for (const file of image.copyFiles) {
        lines.push(`COPY ${file} .`);
      }
      if (image.installCmd) {
        lines.push(`RUN ${image.installCmd}`);
      }
      lines.push('');
    }

    lines.push('COPY . .');
    if (image.buildCmd) {
      lines.push(`RUN ${image.buildCmd}`);
    }
    lines.push('');
  }

  if (nonRootUser) {
    lines.push('# Create non-root user');
    lines.push('RUN addgroup -g 1001 -S appgroup && \\');
    lines.push('    adduser -u 1001 -S appuser -G appgroup');
    lines.push('USER appuser');
    lines.push('');
  }

  if (port > 0) {
    lines.push(`EXPOSE ${port}`);
    lines.push('');
  }

  if (healthcheck && port > 0) {
    lines.push(`HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\`);
    lines.push(`  CMD wget --no-verbose --tries=1 --spider http://localhost:${port}/ || exit 1`);
    lines.push('');
  }

  if (command) {
    const parts = command.split(' ');
    const cmdJson = JSON.stringify(parts);
    lines.push(`CMD ${cmdJson}`);
    lines.push('');
  }

  return lines.join('\n');
}

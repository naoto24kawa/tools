export type ResourceType = 'Deployment' | 'Service' | 'ConfigMap';

export interface DeploymentConfig {
  name: string;
  namespace: string;
  image: string;
  replicas: number;
  containerPort: number;
  labels: Record<string, string>;
  envVars: { name: string; value: string }[];
  resources: {
    requestsCpu: string;
    requestsMemory: string;
    limitsCpu: string;
    limitsMemory: string;
  };
}

export interface ServiceConfig {
  name: string;
  namespace: string;
  type: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  port: number;
  targetPort: number;
  nodePort?: number;
  selector: Record<string, string>;
}

export interface ConfigMapConfig {
  name: string;
  namespace: string;
  data: { key: string; value: string }[];
}

function yamlValue(value: string | number | boolean): string {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (/^\d+$/.test(value)) return `"${value}"`;
  if (value.includes(':') || value.includes('#') || value.includes("'") || value.includes('"')) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  return value;
}

export function generateDeployment(config: DeploymentConfig): string {
  const labels = Object.entries(config.labels).length > 0
    ? config.labels
    : { app: config.name };

  const lines: string[] = [
    'apiVersion: apps/v1',
    'kind: Deployment',
    'metadata:',
    `  name: ${config.name}`,
  ];

  if (config.namespace) {
    lines.push(`  namespace: ${config.namespace}`);
  }

  lines.push('  labels:');
  for (const [k, v] of Object.entries(labels)) {
    lines.push(`    ${k}: ${yamlValue(v)}`);
  }

  lines.push('spec:');
  lines.push(`  replicas: ${config.replicas}`);
  lines.push('  selector:');
  lines.push('    matchLabels:');
  for (const [k, v] of Object.entries(labels)) {
    lines.push(`      ${k}: ${yamlValue(v)}`);
  }
  lines.push('  template:');
  lines.push('    metadata:');
  lines.push('      labels:');
  for (const [k, v] of Object.entries(labels)) {
    lines.push(`        ${k}: ${yamlValue(v)}`);
  }
  lines.push('    spec:');
  lines.push('      containers:');
  lines.push(`        - name: ${config.name}`);
  lines.push(`          image: ${config.image}`);

  if (config.containerPort > 0) {
    lines.push('          ports:');
    lines.push(`            - containerPort: ${config.containerPort}`);
  }

  if (config.envVars.length > 0) {
    lines.push('          env:');
    for (const env of config.envVars) {
      if (env.name) {
        lines.push(`            - name: ${env.name}`);
        lines.push(`              value: ${yamlValue(env.value)}`);
      }
    }
  }

  const hasResources =
    config.resources.requestsCpu ||
    config.resources.requestsMemory ||
    config.resources.limitsCpu ||
    config.resources.limitsMemory;

  if (hasResources) {
    lines.push('          resources:');
    if (config.resources.requestsCpu || config.resources.requestsMemory) {
      lines.push('            requests:');
      if (config.resources.requestsCpu) {
        lines.push(`              cpu: "${config.resources.requestsCpu}"`);
      }
      if (config.resources.requestsMemory) {
        lines.push(`              memory: "${config.resources.requestsMemory}"`);
      }
    }
    if (config.resources.limitsCpu || config.resources.limitsMemory) {
      lines.push('            limits:');
      if (config.resources.limitsCpu) {
        lines.push(`              cpu: "${config.resources.limitsCpu}"`);
      }
      if (config.resources.limitsMemory) {
        lines.push(`              memory: "${config.resources.limitsMemory}"`);
      }
    }
  }

  return lines.join('\n') + '\n';
}

export function generateService(config: ServiceConfig): string {
  const lines: string[] = [
    'apiVersion: v1',
    'kind: Service',
    'metadata:',
    `  name: ${config.name}`,
  ];

  if (config.namespace) {
    lines.push(`  namespace: ${config.namespace}`);
  }

  lines.push('spec:');
  lines.push(`  type: ${config.type}`);
  lines.push('  ports:');
  lines.push(`    - port: ${config.port}`);
  lines.push(`      targetPort: ${config.targetPort}`);
  if (config.type === 'NodePort' && config.nodePort) {
    lines.push(`      nodePort: ${config.nodePort}`);
  }
  lines.push('  selector:');
  for (const [k, v] of Object.entries(config.selector)) {
    lines.push(`    ${k}: ${yamlValue(v)}`);
  }

  return lines.join('\n') + '\n';
}

export function generateConfigMap(config: ConfigMapConfig): string {
  const lines: string[] = [
    'apiVersion: v1',
    'kind: ConfigMap',
    'metadata:',
    `  name: ${config.name}`,
  ];

  if (config.namespace) {
    lines.push(`  namespace: ${config.namespace}`);
  }

  if (config.data.length > 0) {
    lines.push('data:');
    for (const entry of config.data) {
      if (entry.key) {
        lines.push(`  ${entry.key}: ${yamlValue(entry.value)}`);
      }
    }
  }

  return lines.join('\n') + '\n';
}

export const defaultDeploymentConfig: DeploymentConfig = {
  name: 'my-app',
  namespace: 'default',
  image: 'nginx:latest',
  replicas: 3,
  containerPort: 80,
  labels: { app: 'my-app' },
  envVars: [],
  resources: {
    requestsCpu: '100m',
    requestsMemory: '128Mi',
    limitsCpu: '500m',
    limitsMemory: '256Mi',
  },
};

export const defaultServiceConfig: ServiceConfig = {
  name: 'my-app-svc',
  namespace: 'default',
  type: 'ClusterIP',
  port: 80,
  targetPort: 80,
  selector: { app: 'my-app' },
};

export const defaultConfigMapConfig: ConfigMapConfig = {
  name: 'my-config',
  namespace: 'default',
  data: [{ key: 'APP_ENV', value: 'production' }],
};

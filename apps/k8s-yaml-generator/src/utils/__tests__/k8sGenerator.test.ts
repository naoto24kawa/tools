import { describe, it, expect } from 'vitest';
import {
  generateDeployment,
  generateService,
  generateConfigMap,
  generateSecret,
  defaultDeploymentConfig,
  defaultServiceConfig,
  defaultConfigMapConfig,
  defaultSecretConfig,
} from '../k8sGenerator';

describe('generateDeployment', () => {
  it('generates basic deployment yaml', () => {
    const yaml = generateDeployment(defaultDeploymentConfig);
    expect(yaml).toContain('apiVersion: apps/v1');
    expect(yaml).toContain('kind: Deployment');
    expect(yaml).toContain('name: my-app');
    expect(yaml).toContain('image: nginx:latest');
    expect(yaml).toContain('replicas: 3');
    expect(yaml).toContain('containerPort: 80');
  });

  it('includes namespace', () => {
    const yaml = generateDeployment({ ...defaultDeploymentConfig, namespace: 'production' });
    expect(yaml).toContain('namespace: production');
  });

  it('includes environment variables', () => {
    const config = {
      ...defaultDeploymentConfig,
      envVars: [{ name: 'DB_HOST', value: 'localhost' }],
    };
    const yaml = generateDeployment(config);
    expect(yaml).toContain('env:');
    expect(yaml).toContain('name: DB_HOST');
    expect(yaml).toContain('value: localhost');
  });

  it('includes resource limits', () => {
    const yaml = generateDeployment(defaultDeploymentConfig);
    expect(yaml).toContain('resources:');
    expect(yaml).toContain('cpu: "100m"');
    expect(yaml).toContain('memory: "128Mi"');
  });

  it('includes labels', () => {
    const yaml = generateDeployment(defaultDeploymentConfig);
    expect(yaml).toContain('app: my-app');
  });
});

describe('generateService', () => {
  it('generates ClusterIP service', () => {
    const yaml = generateService(defaultServiceConfig);
    expect(yaml).toContain('apiVersion: v1');
    expect(yaml).toContain('kind: Service');
    expect(yaml).toContain('type: ClusterIP');
    expect(yaml).toContain('port: 80');
    expect(yaml).toContain('targetPort: 80');
  });

  it('generates NodePort service with nodePort', () => {
    const config = { ...defaultServiceConfig, type: 'NodePort' as const, nodePort: 30080 };
    const yaml = generateService(config);
    expect(yaml).toContain('type: NodePort');
    expect(yaml).toContain('nodePort: 30080');
  });

  it('generates LoadBalancer service', () => {
    const yaml = generateService({ ...defaultServiceConfig, type: 'LoadBalancer' });
    expect(yaml).toContain('type: LoadBalancer');
  });

  it('includes selector', () => {
    const yaml = generateService(defaultServiceConfig);
    expect(yaml).toContain('selector:');
    expect(yaml).toContain('app: my-app');
  });
});

describe('generateConfigMap', () => {
  it('generates configmap yaml', () => {
    const yaml = generateConfigMap(defaultConfigMapConfig);
    expect(yaml).toContain('apiVersion: v1');
    expect(yaml).toContain('kind: ConfigMap');
    expect(yaml).toContain('name: my-config');
    expect(yaml).toContain('APP_ENV: production');
  });

  it('handles multiple data entries', () => {
    const config = {
      ...defaultConfigMapConfig,
      data: [
        { key: 'KEY1', value: 'value1' },
        { key: 'KEY2', value: 'value2' },
      ],
    };
    const yaml = generateConfigMap(config);
    expect(yaml).toContain('KEY1: value1');
    expect(yaml).toContain('KEY2: value2');
  });

  it('handles empty data', () => {
    const config = { ...defaultConfigMapConfig, data: [] };
    const yaml = generateConfigMap(config);
    expect(yaml).not.toContain('data:');
  });
});

describe('generateSecret', () => {
  it('generates secret yaml with base64 encoded data', () => {
    const yaml = generateSecret(defaultSecretConfig);
    expect(yaml).toContain('apiVersion: v1');
    expect(yaml).toContain('kind: Secret');
    expect(yaml).toContain('name: my-secret');
    expect(yaml).toContain('type: Opaque');
    // Base64 of 'my-secret-password'
    expect(yaml).toContain('password: ' + btoa('my-secret-password'));
  });

  it('includes namespace', () => {
    const yaml = generateSecret({ ...defaultSecretConfig, namespace: 'production' });
    expect(yaml).toContain('namespace: production');
  });

  it('handles TLS type', () => {
    const yaml = generateSecret({ ...defaultSecretConfig, type: 'kubernetes.io/tls' });
    expect(yaml).toContain('type: kubernetes.io/tls');
  });

  it('handles multiple data entries', () => {
    const config = {
      ...defaultSecretConfig,
      data: [
        { key: 'username', value: 'admin' },
        { key: 'password', value: 'secret123' },
      ],
    };
    const yaml = generateSecret(config);
    expect(yaml).toContain('username: ' + btoa('admin'));
    expect(yaml).toContain('password: ' + btoa('secret123'));
  });
});

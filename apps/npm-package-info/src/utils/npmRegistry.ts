export interface PackageInfo {
  name: string;
  description: string;
  latestVersion: string;
  versions: string[];
  license: string;
  homepage: string;
  repository: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  dependenciesCount: number;
  devDependenciesCount: number;
  keywords: string[];
  author: string;
  lastPublished: string;
}

export interface BundleInfo {
  size: number;
  gzip: number;
}

export interface DownloadInfo {
  downloads: number;
  period: string;
}

function extractRepoUrl(repo: unknown): string {
  if (!repo) return '';
  if (typeof repo === 'string') return repo;
  if (typeof repo === 'object' && repo !== null && 'url' in repo) {
    const url = (repo as { url: string }).url;
    return url.replace(/^git\+/, '').replace(/\.git$/, '');
  }
  return '';
}

function extractAuthor(author: unknown): string {
  if (!author) return '';
  if (typeof author === 'string') return author;
  if (typeof author === 'object' && author !== null && 'name' in author) {
    return (author as { name: string }).name;
  }
  return '';
}

export async function fetchPackageInfo(packageName: string): Promise<PackageInfo> {
  const encoded = encodeURIComponent(packageName);
  const response = await fetch(`https://registry.npmjs.org/${encoded}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Package "${packageName}" not found`);
    }
    throw new Error(`Failed to fetch package info: ${response.statusText}`);
  }

  const data = await response.json();

  const latestTag = data['dist-tags']?.latest || '';
  const latestVersionData = data.versions?.[latestTag] || {};
  const versions = Object.keys(data.versions || {}).reverse();

  const deps = latestVersionData.dependencies || {};
  const devDeps = latestVersionData.devDependencies || {};

  return {
    name: data.name || packageName,
    description: data.description || '',
    latestVersion: latestTag,
    versions,
    license: latestVersionData.license || data.license || '',
    homepage: data.homepage || '',
    repository: extractRepoUrl(data.repository),
    dependencies: deps,
    devDependencies: devDeps,
    dependenciesCount: Object.keys(deps).length,
    devDependenciesCount: Object.keys(devDeps).length,
    keywords: data.keywords || [],
    author: extractAuthor(data.author),
    lastPublished: data.time?.[latestTag] || '',
  };
}

export async function fetchDownloads(packageName: string): Promise<DownloadInfo> {
  const encoded = encodeURIComponent(packageName);
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-week/${encoded}`,
  );

  if (!response.ok) {
    return { downloads: 0, period: 'last-week' };
  }

  const data = await response.json();
  return {
    downloads: data.downloads || 0,
    period: 'last-week',
  };
}

export async function fetchBundleSize(packageName: string): Promise<BundleInfo | null> {
  try {
    const encoded = encodeURIComponent(packageName);
    const response = await fetch(
      `https://bundlephobia.com/api/size?package=${encoded}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    return {
      size: data.size || 0,
      gzip: data.gzip || 0,
    };
  } catch {
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export interface KeyframeProperties {
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  opacity: number;
  color: string;
  backgroundColor: string;
}

export interface Keyframe {
  id: string;
  percentage: number;
  properties: KeyframeProperties;
}

export type TimingFunction =
  | 'ease'
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

export type AnimationDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

export interface AnimationSettings {
  name: string;
  duration: number;
  timingFunction: TimingFunction;
  iterationCount: number | 'infinite';
  direction: AnimationDirection;
  delay: number;
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
}

export const DEFAULT_KEYFRAME_PROPERTIES: KeyframeProperties = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scale: 1,
  opacity: 1,
  color: '#000000',
  backgroundColor: '#3b82f6',
};

export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  name: 'myAnimation',
  duration: 1,
  timingFunction: 'ease',
  iterationCount: 'infinite',
  direction: 'normal',
  delay: 0,
  fillMode: 'none',
};

export function generateKeyframesCss(keyframes: Keyframe[], name: string): string {
  if (keyframes.length === 0) return '';

  const sorted = [...keyframes].sort((a, b) => a.percentage - b.percentage);

  const lines = sorted.map((kf) => {
    const props: string[] = [];
    const transforms: string[] = [];

    if (kf.properties.translateX !== 0 || kf.properties.translateY !== 0) {
      transforms.push(`translate(${kf.properties.translateX}px, ${kf.properties.translateY}px)`);
    }
    if (kf.properties.rotate !== 0) {
      transforms.push(`rotate(${kf.properties.rotate}deg)`);
    }
    if (kf.properties.scale !== 1) {
      transforms.push(`scale(${kf.properties.scale})`);
    }

    if (transforms.length > 0) {
      props.push(`    transform: ${transforms.join(' ')};`);
    }
    if (kf.properties.opacity !== 1) {
      props.push(`    opacity: ${kf.properties.opacity};`);
    }
    props.push(`    color: ${kf.properties.color};`);
    props.push(`    background-color: ${kf.properties.backgroundColor};`);

    return `  ${kf.percentage}% {\n${props.join('\n')}\n  }`;
  });

  return `@keyframes ${name} {\n${lines.join('\n')}\n}`;
}

export function generateAnimationCss(settings: AnimationSettings): string {
  const iterCount =
    settings.iterationCount === 'infinite'
      ? 'infinite'
      : String(settings.iterationCount);

  const parts = [
    `${settings.name}`,
    `${settings.duration}s`,
    settings.timingFunction,
    `${settings.delay}s`,
    iterCount,
    settings.direction,
    settings.fillMode,
  ];

  return `animation: ${parts.join(' ')};`;
}

export function generateFullCss(keyframes: Keyframe[], settings: AnimationSettings): string {
  const keyframesCss = generateKeyframesCss(keyframes, settings.name);
  const animationCss = generateAnimationCss(settings);

  return `${keyframesCss}\n\n.animated-element {\n  ${animationCss}\n}`;
}

export function getAnimationStyle(
  keyframes: Keyframe[],
  settings: AnimationSettings
): Record<string, string> {
  const iterCount =
    settings.iterationCount === 'infinite'
      ? 'infinite'
      : String(settings.iterationCount);

  return {
    animationName: settings.name,
    animationDuration: `${settings.duration}s`,
    animationTimingFunction: settings.timingFunction,
    animationDelay: `${settings.delay}s`,
    animationIterationCount: iterCount,
    animationDirection: settings.direction,
    animationFillMode: settings.fillMode,
  };
}

let idCounter = 0;
export function createKeyframeId(): string {
  idCounter += 1;
  return `kf-${idCounter}-${Date.now()}`;
}

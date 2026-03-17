export interface CheckboxConfig {
  width: number;
  height: number;
  activeColor: string;
  inactiveColor: string;
  knobColor: string;
  borderRadius: number;
  type: 'switch' | 'checkbox';
}

export const DEFAULT_CONFIG: CheckboxConfig = {
  width: 48,
  height: 24,
  activeColor: '#3b82f6',
  inactiveColor: '#d1d5db',
  knobColor: '#ffffff',
  borderRadius: 12,
  type: 'switch',
};

export function generateSwitchCSS(config: CheckboxConfig): string {
  const { width, height, activeColor, inactiveColor, knobColor, borderRadius } = config;
  const knobSize = height - 4;
  return `.switch {
  position: relative;
  display: inline-block;
  width: ${width}px;
  height: ${height}px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.switch .slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: ${inactiveColor};
  border-radius: ${borderRadius}px;
  transition: 0.3s;
}
.switch .slider::before {
  content: "";
  position: absolute;
  height: ${knobSize}px;
  width: ${knobSize}px;
  left: 2px;
  bottom: 2px;
  background: ${knobColor};
  border-radius: ${borderRadius}px;
  transition: 0.3s;
}
.switch input:checked + .slider { background: ${activeColor}; }
.switch input:checked + .slider::before { transform: translateX(${width - knobSize - 4}px); }`;
}

export function generateCheckboxCSS(config: CheckboxConfig): string {
  const { activeColor, borderRadius } = config;
  const size = config.height;
  return `.checkbox {
  width: ${size}px;
  height: ${size}px;
  accent-color: ${activeColor};
  border-radius: ${borderRadius}px;
  cursor: pointer;
}`;
}

export function generateCSS(config: CheckboxConfig): string {
  return config.type === 'switch' ? generateSwitchCSS(config) : generateCheckboxCSS(config);
}

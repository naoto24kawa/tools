export interface IconEntry {
  name: string;
  category: string;
  keywords: string[];
}

export const CATEGORIES = [
  'All',
  'Arrows',
  'Communication',
  'Design',
  'Development',
  'Devices',
  'Files',
  'Layout',
  'Media',
  'Navigation',
  'Shapes',
  'Social',
  'Text',
  'Weather',
  'General',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ICON_DATA: IconEntry[] = [
  // Arrows
  { name: 'ArrowUp', category: 'Arrows', keywords: ['up', 'direction', 'arrow'] },
  { name: 'ArrowDown', category: 'Arrows', keywords: ['down', 'direction', 'arrow'] },
  { name: 'ArrowLeft', category: 'Arrows', keywords: ['left', 'direction', 'arrow'] },
  { name: 'ArrowRight', category: 'Arrows', keywords: ['right', 'direction', 'arrow'] },
  { name: 'ArrowUpRight', category: 'Arrows', keywords: ['diagonal', 'direction'] },
  { name: 'ArrowDownLeft', category: 'Arrows', keywords: ['diagonal', 'direction'] },
  { name: 'ChevronUp', category: 'Arrows', keywords: ['up', 'chevron', 'collapse'] },
  { name: 'ChevronDown', category: 'Arrows', keywords: ['down', 'chevron', 'expand'] },
  { name: 'ChevronLeft', category: 'Arrows', keywords: ['left', 'chevron', 'back'] },
  { name: 'ChevronRight', category: 'Arrows', keywords: ['right', 'chevron', 'next'] },
  { name: 'ChevronsUp', category: 'Arrows', keywords: ['up', 'double'] },
  { name: 'ChevronsDown', category: 'Arrows', keywords: ['down', 'double'] },
  { name: 'MoveUp', category: 'Arrows', keywords: ['move', 'up'] },
  { name: 'MoveDown', category: 'Arrows', keywords: ['move', 'down'] },
  { name: 'CornerDownRight', category: 'Arrows', keywords: ['corner', 'turn'] },
  { name: 'RotateCcw', category: 'Arrows', keywords: ['rotate', 'undo', 'refresh'] },
  { name: 'RotateCw', category: 'Arrows', keywords: ['rotate', 'redo', 'refresh'] },
  { name: 'RefreshCw', category: 'Arrows', keywords: ['refresh', 'reload', 'sync'] },
  // Communication
  { name: 'Mail', category: 'Communication', keywords: ['email', 'message', 'envelope'] },
  { name: 'MessageSquare', category: 'Communication', keywords: ['chat', 'comment', 'message'] },
  { name: 'MessageCircle', category: 'Communication', keywords: ['chat', 'bubble'] },
  { name: 'Phone', category: 'Communication', keywords: ['call', 'telephone'] },
  { name: 'Send', category: 'Communication', keywords: ['send', 'submit', 'paper plane'] },
  { name: 'Bell', category: 'Communication', keywords: ['notification', 'alert', 'alarm'] },
  { name: 'BellOff', category: 'Communication', keywords: ['mute', 'silent'] },
  { name: 'AtSign', category: 'Communication', keywords: ['email', 'mention'] },
  { name: 'Inbox', category: 'Communication', keywords: ['inbox', 'mail'] },
  // Design
  { name: 'Palette', category: 'Design', keywords: ['color', 'paint', 'art'] },
  { name: 'Paintbrush', category: 'Design', keywords: ['paint', 'brush', 'art'] },
  { name: 'Pencil', category: 'Design', keywords: ['edit', 'write', 'draw'] },
  { name: 'Eraser', category: 'Design', keywords: ['delete', 'remove', 'clear'] },
  { name: 'Layers', category: 'Design', keywords: ['stack', 'layers', 'overlap'] },
  { name: 'Ruler', category: 'Design', keywords: ['measure', 'size'] },
  { name: 'Pipette', category: 'Design', keywords: ['eyedropper', 'color picker'] },
  { name: 'Crop', category: 'Design', keywords: ['crop', 'trim', 'cut'] },
  { name: 'Scissors', category: 'Design', keywords: ['cut', 'trim'] },
  // Development
  { name: 'Code', category: 'Development', keywords: ['code', 'programming', 'html'] },
  { name: 'Terminal', category: 'Development', keywords: ['terminal', 'console', 'cli'] },
  { name: 'Bug', category: 'Development', keywords: ['bug', 'error', 'debug'] },
  { name: 'Database', category: 'Development', keywords: ['database', 'storage', 'data'] },
  { name: 'Server', category: 'Development', keywords: ['server', 'hosting'] },
  { name: 'GitBranch', category: 'Development', keywords: ['git', 'branch', 'version'] },
  { name: 'GitCommit', category: 'Development', keywords: ['git', 'commit'] },
  { name: 'GitPullRequest', category: 'Development', keywords: ['git', 'pull request', 'pr'] },
  { name: 'Braces', category: 'Development', keywords: ['code', 'json', 'object'] },
  // Devices
  { name: 'Monitor', category: 'Devices', keywords: ['screen', 'display', 'desktop'] },
  { name: 'Smartphone', category: 'Devices', keywords: ['mobile', 'phone'] },
  { name: 'Tablet', category: 'Devices', keywords: ['ipad', 'device'] },
  { name: 'Laptop', category: 'Devices', keywords: ['computer', 'notebook'] },
  { name: 'Printer', category: 'Devices', keywords: ['print', 'output'] },
  { name: 'Keyboard', category: 'Devices', keywords: ['input', 'type'] },
  { name: 'Mouse', category: 'Devices', keywords: ['click', 'cursor'] },
  { name: 'Cpu', category: 'Devices', keywords: ['processor', 'chip'] },
  // Files
  { name: 'File', category: 'Files', keywords: ['file', 'document'] },
  { name: 'FileText', category: 'Files', keywords: ['file', 'text', 'document'] },
  { name: 'FileCode', category: 'Files', keywords: ['file', 'code', 'script'] },
  { name: 'FileImage', category: 'Files', keywords: ['file', 'image', 'photo'] },
  { name: 'Folder', category: 'Files', keywords: ['folder', 'directory'] },
  { name: 'FolderOpen', category: 'Files', keywords: ['folder', 'open'] },
  { name: 'Download', category: 'Files', keywords: ['download', 'save'] },
  { name: 'Upload', category: 'Files', keywords: ['upload', 'send'] },
  { name: 'Paperclip', category: 'Files', keywords: ['attachment', 'clip'] },
  { name: 'Archive', category: 'Files', keywords: ['archive', 'zip', 'compress'] },
  // Layout
  { name: 'Layout', category: 'Layout', keywords: ['layout', 'template'] },
  { name: 'LayoutGrid', category: 'Layout', keywords: ['grid', 'layout'] },
  { name: 'LayoutList', category: 'Layout', keywords: ['list', 'layout'] },
  { name: 'Columns', category: 'Layout', keywords: ['columns', 'split'] },
  { name: 'Rows', category: 'Layout', keywords: ['rows', 'split'] },
  { name: 'SidebarOpen', category: 'Layout', keywords: ['sidebar', 'panel'] },
  { name: 'PanelLeft', category: 'Layout', keywords: ['panel', 'sidebar'] },
  { name: 'Maximize', category: 'Layout', keywords: ['fullscreen', 'expand'] },
  { name: 'Minimize', category: 'Layout', keywords: ['minimize', 'collapse'] },
  // Media
  { name: 'Image', category: 'Media', keywords: ['image', 'photo', 'picture'] },
  { name: 'Camera', category: 'Media', keywords: ['camera', 'photo'] },
  { name: 'Video', category: 'Media', keywords: ['video', 'movie', 'film'] },
  { name: 'Music', category: 'Media', keywords: ['music', 'audio', 'sound'] },
  { name: 'Play', category: 'Media', keywords: ['play', 'start'] },
  { name: 'Pause', category: 'Media', keywords: ['pause', 'stop'] },
  { name: 'SkipForward', category: 'Media', keywords: ['next', 'skip'] },
  { name: 'SkipBack', category: 'Media', keywords: ['previous', 'back'] },
  { name: 'Volume2', category: 'Media', keywords: ['volume', 'sound', 'audio'] },
  { name: 'VolumeX', category: 'Media', keywords: ['mute', 'silent'] },
  // Navigation
  { name: 'Home', category: 'Navigation', keywords: ['home', 'house'] },
  { name: 'Menu', category: 'Navigation', keywords: ['menu', 'hamburger'] },
  { name: 'Search', category: 'Navigation', keywords: ['search', 'find', 'magnifying'] },
  { name: 'Settings', category: 'Navigation', keywords: ['settings', 'gear', 'config'] },
  { name: 'User', category: 'Navigation', keywords: ['user', 'profile', 'person'] },
  { name: 'Users', category: 'Navigation', keywords: ['users', 'team', 'group'] },
  { name: 'LogIn', category: 'Navigation', keywords: ['login', 'sign in'] },
  { name: 'LogOut', category: 'Navigation', keywords: ['logout', 'sign out'] },
  { name: 'ExternalLink', category: 'Navigation', keywords: ['external', 'link', 'open'] },
  { name: 'Link', category: 'Navigation', keywords: ['link', 'url', 'chain'] },
  // Shapes
  { name: 'Circle', category: 'Shapes', keywords: ['circle', 'round'] },
  { name: 'Square', category: 'Shapes', keywords: ['square', 'box'] },
  { name: 'Triangle', category: 'Shapes', keywords: ['triangle', 'shape'] },
  { name: 'Star', category: 'Shapes', keywords: ['star', 'favorite', 'rating'] },
  { name: 'Heart', category: 'Shapes', keywords: ['heart', 'love', 'like'] },
  { name: 'Hexagon', category: 'Shapes', keywords: ['hexagon', 'shape'] },
  { name: 'Diamond', category: 'Shapes', keywords: ['diamond', 'shape'] },
  // Text
  { name: 'Type', category: 'Text', keywords: ['text', 'font', 'type'] },
  { name: 'Bold', category: 'Text', keywords: ['bold', 'strong'] },
  { name: 'Italic', category: 'Text', keywords: ['italic', 'emphasis'] },
  { name: 'Underline', category: 'Text', keywords: ['underline', 'text'] },
  { name: 'AlignLeft', category: 'Text', keywords: ['align', 'left', 'text'] },
  { name: 'AlignCenter', category: 'Text', keywords: ['align', 'center', 'text'] },
  { name: 'AlignRight', category: 'Text', keywords: ['align', 'right', 'text'] },
  { name: 'List', category: 'Text', keywords: ['list', 'bullet'] },
  { name: 'ListOrdered', category: 'Text', keywords: ['list', 'ordered', 'numbered'] },
  // General
  { name: 'Check', category: 'General', keywords: ['check', 'done', 'success'] },
  { name: 'X', category: 'General', keywords: ['close', 'delete', 'remove', 'cancel'] },
  { name: 'Plus', category: 'General', keywords: ['add', 'new', 'create'] },
  { name: 'Minus', category: 'General', keywords: ['subtract', 'remove'] },
  { name: 'Copy', category: 'General', keywords: ['copy', 'duplicate'] },
  { name: 'Clipboard', category: 'General', keywords: ['clipboard', 'paste'] },
  { name: 'Trash2', category: 'General', keywords: ['delete', 'remove', 'trash'] },
  { name: 'Eye', category: 'General', keywords: ['view', 'visible', 'show'] },
  { name: 'EyeOff', category: 'General', keywords: ['hide', 'invisible'] },
  { name: 'Lock', category: 'General', keywords: ['lock', 'secure', 'private'] },
  { name: 'Unlock', category: 'General', keywords: ['unlock', 'open'] },
  { name: 'Shield', category: 'General', keywords: ['shield', 'security', 'protect'] },
  { name: 'Zap', category: 'General', keywords: ['zap', 'lightning', 'power'] },
  { name: 'Clock', category: 'General', keywords: ['time', 'clock', 'schedule'] },
  { name: 'Calendar', category: 'General', keywords: ['calendar', 'date', 'schedule'] },
  { name: 'Map', category: 'General', keywords: ['map', 'location', 'navigation'] },
  { name: 'MapPin', category: 'General', keywords: ['location', 'pin', 'marker'] },
  { name: 'Globe', category: 'General', keywords: ['globe', 'world', 'web', 'internet'] },
  { name: 'Info', category: 'General', keywords: ['info', 'information', 'about'] },
  { name: 'AlertCircle', category: 'General', keywords: ['alert', 'warning', 'error'] },
  { name: 'AlertTriangle', category: 'General', keywords: ['warning', 'caution'] },
  { name: 'HelpCircle', category: 'General', keywords: ['help', 'question', 'faq'] },
  { name: 'Bookmark', category: 'General', keywords: ['bookmark', 'save', 'favorite'] },
  { name: 'Tag', category: 'General', keywords: ['tag', 'label', 'category'] },
  { name: 'Filter', category: 'General', keywords: ['filter', 'funnel', 'sort'] },
  { name: 'MoreHorizontal', category: 'General', keywords: ['more', 'menu', 'dots'] },
  { name: 'MoreVertical', category: 'General', keywords: ['more', 'menu', 'dots'] },
  // Weather
  { name: 'Sun', category: 'Weather', keywords: ['sun', 'light', 'day', 'bright'] },
  { name: 'Moon', category: 'Weather', keywords: ['moon', 'night', 'dark'] },
  { name: 'Cloud', category: 'Weather', keywords: ['cloud', 'weather'] },
  { name: 'CloudRain', category: 'Weather', keywords: ['rain', 'weather'] },
  { name: 'CloudSnow', category: 'Weather', keywords: ['snow', 'weather', 'cold'] },
  { name: 'Wind', category: 'Weather', keywords: ['wind', 'weather', 'breeze'] },
  { name: 'Thermometer', category: 'Weather', keywords: ['temperature', 'heat'] },
  // Social
  { name: 'Github', category: 'Social', keywords: ['github', 'git', 'repository'] },
  { name: 'Twitter', category: 'Social', keywords: ['twitter', 'social', 'tweet'] },
  { name: 'Share2', category: 'Social', keywords: ['share', 'social'] },
  { name: 'ThumbsUp', category: 'Social', keywords: ['like', 'approve', 'thumbs up'] },
  { name: 'ThumbsDown', category: 'Social', keywords: ['dislike', 'disapprove'] },
  { name: 'Award', category: 'Social', keywords: ['award', 'achievement', 'badge'] },
];

export function filterIcons(icons: IconEntry[], search: string, category: Category): IconEntry[] {
  let filtered = icons;

  if (category !== 'All') {
    filtered = filtered.filter((icon) => icon.category === category);
  }

  if (search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.keywords.some((kw) => kw.includes(query)) ||
        icon.category.toLowerCase().includes(query)
    );
  }

  return filtered;
}

export function getComponentImport(iconName: string): string {
  return `import { ${iconName} } from 'lucide-react';`;
}

export function toKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/// <reference types="vite-plus/client" />

// CSS Modules
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

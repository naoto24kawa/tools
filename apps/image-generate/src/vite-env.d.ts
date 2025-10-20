/// <reference types="vite/client" />

// CSS Modules の型定義
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

import { Window } from 'happy-dom';
import '@testing-library/jest-dom';

const window = new Window();
const document = window.document;

// @ts-ignore
global.window = window;
// @ts-ignore
global.document = document;
// @ts-ignore
global.navigator = window.navigator;
// @ts-ignore
global.HTMLElement = window.HTMLElement;
// @ts-ignore
global.Node = window.Node;
// @ts-ignore
global.Text = window.Text;
// @ts-ignore
global.HTMLInputElement = window.HTMLInputElement;
// @ts-ignore
global.HTMLButtonElement = window.HTMLButtonElement;
// @ts-ignore
global.HTMLDivElement = window.HTMLDivElement;
// @ts-ignore
global.DocumentFragment = window.DocumentFragment;
// @ts-ignore
global.MutationObserver = window.MutationObserver;
// @ts-ignore
global.SVGElement = window.SVGElement;

import { afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';

// グローバルなテストセットアップ
// 必要に応じてモックやグローバル設定を追加

// テストごとのクリーンアップ
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
  window.localStorage.clear();
});

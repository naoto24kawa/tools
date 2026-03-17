import type { AppConfig } from '../config/apps';
import { getAppsByCategory } from '../config/apps';

/**
 * ツール一覧ページのHTMLを生成
 *
 * @param tools アプリケーション設定の配列
 * @returns HTML文字列
 */
export function renderToolsPage(tools: readonly AppConfig[]): string {
  const categories = getAppsByCategory(tools);

  const categorySections = Array.from(categories.entries())
    .map(
      ([category, apps]) => `
    <section class="category">
      <h2 class="category-title">${category} <span class="category-count">(${apps.length})</span></h2>
      <ul class="tools-list">
        ${apps
          .map(
            (tool) => `
        <li class="tool-item">
          <a href="${tool.path}/" class="tool-link">
            <div class="tool-name">${tool.icon} ${tool.displayName}</div>
            <div class="tool-description">${tool.description}</div>
          </a>
        </li>`
          )
          .join('')}
      </ul>
    </section>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tools - elchika</title>
  ${getStyles()}
</head>
<body>
  <div class="container">
    <h1>🛠️ Tools</h1>
    <p class="subtitle">プログラマーのための便利ツール集 (${tools.length} tools)</p>
    <p class="security-note">🔒 すべての処理はブラウザ内で完結。データの外部送信・保存はありません。</p>
    ${categorySections}
  </div>
</body>
</html>`;
}

/**
 * スタイル定義
 */
function getStyles(): string {
  return `<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 1000px;
      width: 100%;
      margin: 0 auto;
    }

    h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }

    .security-note {
      text-align: center;
      color: #059669;
      margin-bottom: 30px;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .category {
      margin-bottom: 30px;
    }

    .category-title {
      font-size: 1.4rem;
      color: #444;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .category-count {
      color: #9ca3af;
      font-weight: normal;
      font-size: 1rem;
    }

    .tools-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }

    .tool-item {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .tool-item:hover {
      transform: translateY(-3px);
    }

    .tool-link {
      display: block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .tool-link:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .tool-name {
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .tool-description {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    @media (max-width: 600px) {
      .container {
        padding: 20px 15px;
      }

      h1 {
        font-size: 2rem;
      }

      .tools-list {
        grid-template-columns: 1fr;
      }
    }
  </style>`;
}

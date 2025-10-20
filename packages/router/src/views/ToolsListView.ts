import type { APPS_CONFIG } from '../config/apps';

type AppConfig = (typeof APPS_CONFIG)[number];

/**
 * ツール一覧ページのHTMLを生成
 *
 * @param tools アプリケーション設定の配列
 * @returns HTML文字列
 */
export function renderToolsPage(tools: readonly AppConfig[]): string {
  const toolsListHtml = tools
    .map(
      (tool) => `
    <li class="tool-item">
      <a href="${tool.path}/" class="tool-link">
        <div class="tool-name">${tool.icon} ${tool.displayName}</div>
        <div class="tool-description">${tool.description}</div>
      </a>
    </li>`
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
    <p class="subtitle">便利なツール集</p>
    <ul class="tools-list">
      ${toolsListHtml}
    </ul>
    <footer>
      Powered by Cloudflare Workers + Pages
    </footer>
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 800px;
      width: 100%;
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
      margin-bottom: 30px;
      font-size: 1.1rem;
    }

    .tools-list {
      list-style: none;
      display: grid;
      gap: 20px;
    }

    .tool-item {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .tool-item:hover {
      transform: translateY(-5px);
    }

    .tool-link {
      display: block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 25px 30px;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .tool-link:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    .tool-name {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .tool-description {
      font-size: 1rem;
      opacity: 0.9;
    }

    footer {
      text-align: center;
      margin-top: 30px;
      color: #999;
      font-size: 0.9rem;
    }

    @media (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }

      h1 {
        font-size: 2rem;
      }

      .tool-name {
        font-size: 1.3rem;
      }
    }
  </style>`;
}

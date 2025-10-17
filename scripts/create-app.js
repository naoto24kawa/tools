#!/usr/bin/env node

/**
 * 新規アプリケーション作成スクリプト（メインルーター自動更新機能付き）
 *
 * 使い方:
 *   npm run create-app <app-name> [description]
 *
 * 例:
 *   npm run create-app pdf-converter "PDFコンバーター"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const toml = require('@iarna/toml');

// コマンドライン引数を取得
const args = process.argv.slice(2);

// ヘルプメッセージ
function showHelp() {
  console.log(`
新規アプリケーション作成スクリプト

使い方:
  npm run create-app <app-name> [description]

引数:
  app-name     アプリ名（kebab-case、例: image-crop）
  description  アプリの説明（省略可、対話的に入力）

例:
  npm run create-app pdf-converter "PDFコンバーター"
  npm run create-app image-resize

オプション:
  --help, -h        このヘルプを表示
  --skip-router     メインルーターへの追加をスキップ（手動で追加する場合）
`);
}

// ヘルプフラグのチェック
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// kebab-caseをPascalCaseに変換
function kebabToPascal(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// kebab-caseをSNAKE_CASEに変換
function kebabToSnakeUpper(str) {
  return str.toUpperCase().replace(/-/g, '_');
}

// kebab-caseのバリデーション
function isValidKebabCase(str) {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(str);
}

// ファイルをバックアップ
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`   📦 バックアップ作成: ${path.basename(backupPath)}`);
  }
}

// ディレクトリを再帰的にコピー
function copyDirectory(src, dest, replacements) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');

      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(key, 'g'), value);
      }

      fs.writeFileSync(destPath, content, 'utf8');
    }
  }
}

// wrangler.tomlにService Bindingを追加
function updateWranglerToml(appName, appNameSnake) {
  const wranglerPath = path.join(__dirname, '..', 'wrangler.toml');

  backupFile(wranglerPath);

  try {
    const content = fs.readFileSync(wranglerPath, 'utf8');
    const config = toml.parse(content);

    // Service Bindingsが存在しない場合は作成
    if (!config.services) {
      config.services = [];
    }

    // すでに存在するかチェック
    const exists = config.services.some(s => s.service === `tools-${appName}`);
    if (exists) {
      console.log(`   ⚠️  Service Binding はすでに存在します`);
      return;
    }

    // 新しいService Bindingを追加
    config.services.push({
      binding: appNameSnake,
      service: `tools-${appName}`
    });

    // TOMLとして書き出し
    fs.writeFileSync(wranglerPath, toml.stringify(config));
    console.log(`   ✅ wrangler.toml に Service Binding を追加`);

  } catch (error) {
    console.error(`   ❌ wrangler.toml の更新に失敗:`, error.message);
    throw error;
  }
}

// package.jsonにデプロイスクリプトを追加
function updatePackageJson(appName) {
  const packagePath = path.join(__dirname, '..', 'package.json');

  backupFile(packagePath);

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    const scriptName = `deploy:${appName}`;
    const scriptCommand = `cd apps/${appName} && npm install && wrangler deploy`;

    if (pkg.scripts[scriptName]) {
      console.log(`   ⚠️  デプロイスクリプトはすでに存在します`);
      return;
    }

    pkg.scripts[scriptName] = scriptCommand;

    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`   ✅ package.json にデプロイスクリプトを追加`);

  } catch (error) {
    console.error(`   ❌ package.json の更新に失敗:`, error.message);
    throw error;
  }
}

// src/index.tsを更新（マーカーコメント付き）
function updateIndexTs(appName, appNamePascal, appNameSnake, description) {
  const indexPath = path.join(__dirname, '..', 'src', 'index.ts');

  backupFile(indexPath);

  try {
    let content = fs.readFileSync(indexPath, 'utf8');

    // 1. 型定義に追加
    const typeBindingMarker = '// Service Bindingsの型定義';
    const typeBindingCode = `  ${appNameSnake}: Fetcher // BEGIN APP: ${appName}\n`;

    const typeBindingRegex = /(type Bindings = \{[^}]*)/;
    if (typeBindingRegex.test(content)) {
      content = content.replace(typeBindingRegex, (match) => {
        return match + `\n${typeBindingCode}`;
      });
      console.log(`   ✅ 型定義を追加`);
    }

    // 2. availableApps配列に追加
    const availableAppsCode = `      {\n        name: '${appName}',\n        path: '/${appName}',\n        description: '${description}'\n      }, // BEGIN APP: ${appName}\n`;

    const availableAppsRegex = /(availableApps: \[[^\]]*)/;
    if (availableAppsRegex.test(content)) {
      content = content.replace(availableAppsRegex, (match) => {
        // 最後の要素の後に追加
        return match + `\n${availableAppsCode}`;
      });
      console.log(`   ✅ availableApps配列に追加`);
    }

    // 3. availablePaths配列に追加
    const availablePathsCode = `, '/${appName}' // BEGIN APP: ${appName}`;
    const availablePathsRegex = /(availablePaths: \[[^\]]*)/;
    if (availablePathsRegex.test(content)) {
      content = content.replace(availablePathsRegex, (match) => {
        return match + availablePathsCode;
      });
      console.log(`   ✅ availablePaths配列に追加`);
    }

    // 4. ルーティング関数を追加
    const routingCode = `
// ${description} へのルーティング // BEGIN APP: ${appName}
app.all('/${appName}/*', async (c) => {
  try {
    const path = c.req.path.replace('/${appName}', '') || '/'
    const url = new URL(path, 'http://internal')

    const request = new Request(url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    })

    return await c.env.${appNameSnake}.fetch(request)
  } catch (error) {
    console.error('Error proxying to ${appName}:', error)
    return c.json({
      error: 'Service unavailable',
      message: '${description}への接続に失敗しました'
    }, 503)
  }
}) // END APP: ${appName}
`;

    // 404ハンドラーの前に挿入
    const notFoundRegex = /(\/\/ 404エラーハンドラー)/;
    if (notFoundRegex.test(content)) {
      content = content.replace(notFoundRegex, routingCode + '\n$1');
      console.log(`   ✅ ルーティング関数を追加`);
    }

    fs.writeFileSync(indexPath, content, 'utf8');

  } catch (error) {
    console.error(`   ❌ src/index.ts の更新に失敗:`, error.message);
    throw error;
  }
}

// 次のステップを表示
function showNextSteps(appName) {
  console.log(`
✅ アプリケーション "${appName}" が作成され、メインルーターに追加されました！

📝 次のステップ:

1. 依存関係をインストール:

   cd apps/${appName}
   npm install

2. ローカルで開発:

   npm run dev

3. アプリケーションのロジックを実装:

   apps/${appName}/src/index.ts を編集

4. デプロイ:

   # 子アプリをデプロイ
   npm run deploy:${appName}

   # メインルーターを再デプロイ
   cd ../..
   npm run deploy:router

💡 ヒント:
   - バックアップファイル(.backup)は安全確認後に削除できます
   - テストが完了したら npm install を実行してください

アプリケーションのパス: apps/${appName}
`);
}

// 対話的に入力を取得
async function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// メイン処理
async function main() {
  // アプリ名を取得
  let appName = args.find(arg => !arg.startsWith('--'));

  if (!appName) {
    appName = await promptInput('アプリ名（kebab-case、例: image-crop）: ');
  }

  // アプリ名のバリデーション
  if (!isValidKebabCase(appName)) {
    console.error(`❌ エラー: アプリ名は kebab-case（小文字とハイフン）で指定してください。`);
    console.error(`   例: image-crop, pdf-converter`);
    process.exit(1);
  }

  // アプリの説明を取得
  let description = args[args.indexOf(appName) + 1];
  if (!description || description.startsWith('--')) {
    description = await promptInput('アプリの説明: ');
  }

  // 変換
  const appNamePascal = kebabToPascal(appName);
  const appNameSnake = kebabToSnakeUpper(appName);
  const serviceName = `tools-${appName}`;
  const skipRouter = args.includes('--skip-router');

  // ターゲットディレクトリ
  const targetDir = path.join(__dirname, '..', 'apps', appName);

  // すでに存在する場合はエラー
  if (fs.existsSync(targetDir)) {
    console.error(`❌ エラー: アプリ "${appName}" はすでに存在します。`);
    process.exit(1);
  }

  // テンプレートディレクトリ
  const templateDir = path.join(__dirname, '..', 'templates', 'app');

  // テンプレートが存在するか確認
  if (!fs.existsSync(templateDir)) {
    console.error(`❌ エラー: テンプレートディレクトリが見つかりません: ${templateDir}`);
    process.exit(1);
  }

  // プレースホルダーの置換マップ
  const replacements = {
    '\\{\\{APP_NAME\\}\\}': appName,
    '\\{\\{APP_NAME_PASCAL\\}\\}': appNamePascal,
    '\\{\\{APP_DESCRIPTION\\}\\}': description,
    '\\{\\{SERVICE_NAME\\}\\}': serviceName,
  };

  console.log(`\n🚀 新規アプリケーション "${appName}" を作成しています...\n`);

  try {
    // 1. テンプレートをコピー
    copyDirectory(templateDir, targetDir, replacements);

    console.log(`✨ アプリディレクトリを生成しました:`);
    console.log(`   - apps/${appName}/package.json`);
    console.log(`   - apps/${appName}/wrangler.toml`);
    console.log(`   - apps/${appName}/tsconfig.json`);
    console.log(`   - apps/${appName}/src/index.ts\n`);

    // 2. メインルーターを更新
    if (!skipRouter) {
      console.log(`🔧 メインルーターを更新しています...\n`);

      updateWranglerToml(appName, appNameSnake);
      updatePackageJson(appName);
      updateIndexTs(appName, appNamePascal, appNameSnake, description);

      console.log();
    }

    // 次のステップを表示
    showNextSteps(appName);

  } catch (error) {
    console.error(`\n❌ エラーが発生しました:`, error.message);
    console.error(`\n💡 バックアップファイル(.backup)から復元できます`);
    process.exit(1);
  }
}

// スクリプト実行
main().catch((error) => {
  console.error('予期しないエラー:', error);
  process.exit(1);
});

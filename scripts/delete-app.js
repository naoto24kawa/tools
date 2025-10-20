#!/usr/bin/env node

/**
 * アプリケーション削除スクリプト（メインルーター自動削除機能付き）
 *
 * 使い方:
 *   npm run delete-app <app-name>
 *
 * 例:
 *   npm run delete-app pdf-converter
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const toml = require('@iarna/toml');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

// コマンドライン引数を取得
const args = process.argv.slice(2);

// ヘルプメッセージ
function showHelp() {
  console.log(`
アプリケーション削除スクリプト

使い方:
  npm run delete-app <app-name>

引数:
  app-name     削除するアプリ名（kebab-case、例: image-crop）

オプション:
  --help, -h        このヘルプを表示
  --force, -f       確認なしで削除（注意）
  --skip-router     メインルーターの更新をスキップ
  --delete-worker   Cloudflare Workerも削除

例:
  npm run delete-app pdf-converter
  npm run delete-app image-resize --force
  npm run delete-app test-tool --delete-worker

注意:
  デフォルトでは以下を自動で削除します:
  - apps/<app-name>/ ディレクトリ
  - wrangler.toml の Service Binding
  - package.json のデプロイスクリプト
  - src/index.ts の型定義、ルーティング、配列要素
`);
}

// ヘルプフラグのチェック
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

// forceフラグのチェック
const forceDelete = args.includes('--force') || args.includes('-f');
const skipRouter = args.includes('--skip-router');
const deleteWorker = args.includes('--delete-worker');

// kebab-caseをPascalCaseに変換
function kebabToPascal(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// kebab-caseをSNAKE_CASEに変換
function kebabToSnakeUpper(str) {
  return str.toUpperCase().replace(/-/g, '_');
}

// ファイルをバックアップ
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`   📦 バックアップ作成: ${path.basename(backupPath)}`);
  }
}

// ディレクトリを再帰的に削除
function removeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      removeDirectory(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }

  fs.rmdirSync(dirPath);
}

// 対話的に確認を取得
async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// wrangler.tomlからService Bindingを削除
function removeFromWranglerToml(appName) {
  const wranglerPath = path.join(__dirname, '..', 'wrangler.toml');

  if (!fs.existsSync(wranglerPath)) {
    console.log(`   ⚠️  wrangler.toml が見つかりません`);
    return;
  }

  backupFile(wranglerPath);

  try {
    const content = fs.readFileSync(wranglerPath, 'utf8');
    const config = toml.parse(content);

    if (!config.services) {
      console.log(`   ⚠️  Service Bindings が存在しません`);
      return;
    }

    // 該当するService Bindingを削除
    const originalLength = config.services.length;
    config.services = config.services.filter((s) => s.service !== `tools-${appName}`);

    if (config.services.length === originalLength) {
      console.log(`   ⚠️  Service Binding が見つかりませんでした`);
      return;
    }

    // TOMLとして書き出し
    fs.writeFileSync(wranglerPath, toml.stringify(config));
    console.log(`   ✅ wrangler.toml から Service Binding を削除`);
  } catch (error) {
    console.error(`   ❌ wrangler.toml の更新に失敗:`, error.message);
    throw error;
  }
}

// package.jsonからデプロイスクリプトを削除
function removeFromPackageJson(appName) {
  const packagePath = path.join(__dirname, '..', 'package.json');

  if (!fs.existsSync(packagePath)) {
    console.log(`   ⚠️  package.json が見つかりません`);
    return;
  }

  backupFile(packagePath);

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    const scriptName = `deploy:${appName}`;

    if (!pkg.scripts[scriptName]) {
      console.log(`   ⚠️  デプロイスクリプトが見つかりませんでした`);
      return;
    }

    delete pkg.scripts[scriptName];

    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`   ✅ package.json からデプロイスクリプトを削除`);
  } catch (error) {
    console.error(`   ❌ package.json の更新に失敗:`, error.message);
    throw error;
  }
}

// src/index.tsから関連コードを削除（マーカーベース）
function removeFromIndexTs(appName, appNameSnake) {
  const indexPath = path.join(__dirname, '..', 'src', 'index.ts');

  if (!fs.existsSync(indexPath)) {
    console.log(`   ⚠️  src/index.ts が見つかりません`);
    return;
  }

  backupFile(indexPath);

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    let modified = false;

    // 1. 型定義を削除（マーカーコメント付き）
    const typeRegex = new RegExp(`\\s*${appNameSnake}: Fetcher \/\/ BEGIN APP: ${appName}\\n`, 'g');
    if (typeRegex.test(content)) {
      content = content.replace(typeRegex, '');
      console.log(`   ✅ 型定義を削除`);
      modified = true;
    }

    // 2. availableApps配列の要素を削除
    const availableAppsRegex = new RegExp(
      `\\s*\\{[^}]*name: '${appName}'[^}]*\\}, \/\/ BEGIN APP: ${appName}\\n`,
      'g'
    );
    if (availableAppsRegex.test(content)) {
      content = content.replace(availableAppsRegex, '');
      console.log(`   ✅ availableApps配列から削除`);
      modified = true;
    }

    // 3. availablePaths配列の要素を削除
    const availablePathsRegex = new RegExp(`, '\\/${appName}' \/\/ BEGIN APP: ${appName}`, 'g');
    if (availablePathsRegex.test(content)) {
      content = content.replace(availablePathsRegex, '');
      console.log(`   ✅ availablePaths配列から削除`);
      modified = true;
    }

    // 4. ルーティング関数を削除（BEGIN/ENDマーカー間）
    const routingRegex = new RegExp(
      `\n\/\/ .*? \/\/ BEGIN APP: ${appName}[\\s\\S]*?\/\/ END APP: ${appName}\\n`,
      'g'
    );
    if (routingRegex.test(content)) {
      content = content.replace(routingRegex, '\n');
      console.log(`   ✅ ルーティング関数を削除`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(indexPath, content, 'utf8');
    } else {
      console.log(`   ⚠️  削除対象のコードが見つかりませんでした`);
    }
  } catch (error) {
    console.error(`   ❌ src/index.ts の更新に失敗:`, error.message);
    throw error;
  }
}

// Cloudflare Workerを削除
async function deleteCloudflareWorker(appName) {
  const serviceName = `tools-${appName}`;

  console.log(`\n🔧 Cloudflare Worker の削除を試みています...\n`);

  try {
    const { stdout, stderr } = await execPromise(`wrangler delete ${serviceName}`);

    if (stderr && !stderr.includes('Successfully')) {
      console.error(`   ⚠️  警告: ${stderr}`);
    }

    console.log(`   ✅ Cloudflare Worker を削除: ${serviceName}`);
  } catch (error) {
    console.error(`   ❌ Cloudflare Worker の削除に失敗:`, error.message);
    console.error(`   💡 手動で削除してください: wrangler delete ${serviceName}`);
  }
}

// メイン処理
async function main() {
  // アプリ名を取得
  const appName = args.find((arg) => !arg.startsWith('--'));

  if (!appName) {
    console.error('❌ エラー: アプリ名を指定してください。');
    console.error('使い方: npm run delete-app <app-name>');
    console.error('詳細: npm run delete-app --help');
    process.exit(1);
  }

  // 変換
  const appNamePascal = kebabToPascal(appName);
  const appNameSnake = kebabToSnakeUpper(appName);

  // ターゲットディレクトリ
  const targetDir = path.join(__dirname, '..', 'apps', appName);

  // 存在チェック
  if (!fs.existsSync(targetDir)) {
    console.error(`❌ エラー: アプリ "${appName}" は存在しません。`);
    console.error(`パス: ${targetDir}`);
    process.exit(1);
  }

  // 確認
  if (!forceDelete) {
    console.log(`\n⚠️  警告: 以下を削除します:\n`);
    console.log(`   📁 ディレクトリ: apps/${appName}/`);
    if (!skipRouter) {
      console.log(`   📝 wrangler.toml から Service Binding`);
      console.log(`   📝 package.json からデプロイスクリプト`);
      console.log(`   📝 src/index.ts から型定義とルーティング`);
    }
    if (deleteWorker) {
      console.log(`   ☁️  Cloudflare Worker: tools-${appName}`);
    }
    console.log();

    const confirmed = await confirm('本当に削除しますか？ (y/N): ');

    if (!confirmed) {
      console.log('\n✋ 削除をキャンセルしました。');
      process.exit(0);
    }
  }

  console.log(`\n🗑️  アプリケーション "${appName}" を削除しています...\n`);

  try {
    // 1. メインルーターから削除
    if (!skipRouter) {
      console.log(`🔧 メインルーターを更新しています...\n`);

      removeFromWranglerToml(appName);
      removeFromPackageJson(appName);
      removeFromIndexTs(appName, appNameSnake);

      console.log();
    }

    // 2. ディレクトリを削除
    removeDirectory(targetDir);
    console.log(`✅ ディレクトリを削除しました: apps/${appName}/\n`);

    // 3. Cloudflare Workerを削除（オプション）
    if (deleteWorker) {
      await deleteCloudflareWorker(appName);
    }

    console.log(`
✅ アプリケーション "${appName}" の削除が完了しました！

💡 次のステップ:

1. バックアップファイルの確認:
   - 問題なければ .backup ファイルを削除できます

2. メインルーターを再デプロイ:
   npm run deploy:router

${
  deleteWorker
    ? ''
    : `3. Cloudflare Worker を手動削除（必要な場合）:
   wrangler delete tools-${appName}
`
}
`);
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

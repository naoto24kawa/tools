export function Header() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-2">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Tools トップに戻る
          </a>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">📝 Text Diff Checker</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          2つのテキストを比較して差分を視覚的に表示。コードレビュー、文書比較、変更履歴の確認に最適。
        </p>
        <p className="mt-1 text-xs text-muted-foreground/80">
          🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
        </p>
      </div>
    </header>
  );
}

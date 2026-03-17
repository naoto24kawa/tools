export interface HttpStatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

export const HTTP_STATUS_CODES: HttpStatusCode[] = [
  {
    code: 100,
    name: 'Continue',
    description: 'リクエストの最初の部分を受け取り、残りを待っている',
    category: '1xx Informational',
  },
  {
    code: 101,
    name: 'Switching Protocols',
    description: 'プロトコルの切り替えに同意',
    category: '1xx Informational',
  },
  { code: 200, name: 'OK', description: 'リクエスト成功', category: '2xx Success' },
  { code: 201, name: 'Created', description: 'リソースが作成された', category: '2xx Success' },
  {
    code: 202,
    name: 'Accepted',
    description: 'リクエストは受理されたが未処理',
    category: '2xx Success',
  },
  {
    code: 204,
    name: 'No Content',
    description: '成功したがレスポンスボディなし',
    category: '2xx Success',
  },
  {
    code: 206,
    name: 'Partial Content',
    description: '部分的なコンテンツを返却',
    category: '2xx Success',
  },
  {
    code: 301,
    name: 'Moved Permanently',
    description: 'リソースが恒久的に移動',
    category: '3xx Redirection',
  },
  { code: 302, name: 'Found', description: 'リソースが一時的に移動', category: '3xx Redirection' },
  { code: 303, name: 'See Other', description: '別のURIを参照', category: '3xx Redirection' },
  { code: 304, name: 'Not Modified', description: 'キャッシュが有効', category: '3xx Redirection' },
  {
    code: 307,
    name: 'Temporary Redirect',
    description: '一時的なリダイレクト(メソッド維持)',
    category: '3xx Redirection',
  },
  {
    code: 308,
    name: 'Permanent Redirect',
    description: '恒久的なリダイレクト(メソッド維持)',
    category: '3xx Redirection',
  },
  { code: 400, name: 'Bad Request', description: 'リクエストが不正', category: '4xx Client Error' },
  { code: 401, name: 'Unauthorized', description: '認証が必要', category: '4xx Client Error' },
  { code: 403, name: 'Forbidden', description: 'アクセス権限なし', category: '4xx Client Error' },
  {
    code: 404,
    name: 'Not Found',
    description: 'リソースが見つからない',
    category: '4xx Client Error',
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    description: 'メソッドが許可されていない',
    category: '4xx Client Error',
  },
  {
    code: 406,
    name: 'Not Acceptable',
    description: '受け入れ可能なコンテンツなし',
    category: '4xx Client Error',
  },
  {
    code: 408,
    name: 'Request Timeout',
    description: 'リクエストがタイムアウト',
    category: '4xx Client Error',
  },
  { code: 409, name: 'Conflict', description: 'リソースの競合', category: '4xx Client Error' },
  { code: 410, name: 'Gone', description: 'リソースが永久に削除', category: '4xx Client Error' },
  {
    code: 413,
    name: 'Payload Too Large',
    description: 'リクエストボディが大きすぎる',
    category: '4xx Client Error',
  },
  {
    code: 415,
    name: 'Unsupported Media Type',
    description: 'メディアタイプが未サポート',
    category: '4xx Client Error',
  },
  {
    code: 422,
    name: 'Unprocessable Entity',
    description: '処理できないエンティティ',
    category: '4xx Client Error',
  },
  {
    code: 429,
    name: 'Too Many Requests',
    description: 'リクエストが多すぎる',
    category: '4xx Client Error',
  },
  {
    code: 500,
    name: 'Internal Server Error',
    description: 'サーバー内部エラー',
    category: '5xx Server Error',
  },
  { code: 501, name: 'Not Implemented', description: '未実装', category: '5xx Server Error' },
  {
    code: 502,
    name: 'Bad Gateway',
    description: 'ゲートウェイエラー',
    category: '5xx Server Error',
  },
  {
    code: 503,
    name: 'Service Unavailable',
    description: 'サービス利用不可',
    category: '5xx Server Error',
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    description: 'ゲートウェイタイムアウト',
    category: '5xx Server Error',
  },
];

export function filterStatusCodes(
  codes: HttpStatusCode[],
  query: string,
  category: string
): HttpStatusCode[] {
  return codes.filter((c) => {
    if (category && c.category !== category) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(c.code).includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });
}

export function getCategories(codes: HttpStatusCode[]): string[] {
  return [...new Set(codes.map((c) => c.category))];
}

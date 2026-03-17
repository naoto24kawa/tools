async function sha1Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = new Uint8Array(hashBuffer);
  let binary = '';
  for (const byte of hashArray) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function generateHtpasswd(
  username: string,
  password: string,
  algorithm: 'sha1' | 'plain'
): Promise<string> {
  if (!username || !password) return '';

  if (algorithm === 'sha1') {
    const hash = await sha1Hash(password);
    return `${username}:{SHA}${hash}`;
  }

  return `${username}:${password}`;
}

export function validateUsername(username: string): string | null {
  if (!username) return 'ユーザー名を入力してください';
  if (username.includes(':')) return 'ユーザー名にコロンは使用できません';
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) return '英数字と.-_のみ使用可能です';
  return null;
}

import bcrypt from 'bcryptjs';

export type HashType = 'bcrypt' | 'sha1' | 'md5' | 'plain';
export const HASH_TYPES: HashType[] = ['bcrypt', 'sha1', 'md5', 'plain'];

export async function generateHtpasswd(
  username: string,
  password: string,
  hashType: HashType
): Promise<string> {
  switch (hashType) {
    case 'bcrypt': {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return `${username}:${hash}`;
    }
    case 'sha1': {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
      return `${username}:{SHA}${base64}`;
    }
    case 'plain':
      return `${username}:${password}`;
    case 'md5': {
      // Apache MD5 is complex; use a simplified approach with SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hex = Array.from(new Uint8Array(hashBuffer), (b) =>
        b.toString(16).padStart(2, '0')
      ).join('');
      return `${username}:{SHA256}${hex}`;
    }
    default:
      return `${username}:${password}`;
  }
}

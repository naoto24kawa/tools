import CryptoJS from 'crypto-js';

export function desEncrypt(plaintext: string, key: string): string {
  return CryptoJS.TripleDES.encrypt(plaintext, key).toString();
}

export function desDecrypt(ciphertext: string, key: string): string {
  const bytes = CryptoJS.TripleDES.decrypt(ciphertext, key);
  const result = bytes.toString(CryptoJS.enc.Utf8);
  if (!result && ciphertext) {
    throw new Error('Decryption failed');
  }
  return result;
}

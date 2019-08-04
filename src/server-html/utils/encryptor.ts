const encryptor = require('simple-encryptor')('rlagustjq1q2w3e4r!@#$');

export function encrypt(text: string): string {
  return encryptor.encrypt(text);
}

export function decrypt(cipher: string): string {
  return encryptor.decrypt(cipher);
}
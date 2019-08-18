import * as NodeRSA from 'node-rsa';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateKey(): RSAKeyPair {
  const key = new NodeRSA({b: 2048});
  return {
    publicKey: key.exportKey('pkcs8-public'),
    privateKey: key.exportKey('pkcs8-private'),
  }
}

export function decrypt(cipher: string, privateKeyString: string): string {
  const privateKey = new NodeRSA(privateKeyString, 'pkcs8-private');
  return privateKey.decrypt(cipher, 'utf8');
}

export function encrypt(plaintext: string, publicKeyString: string): string {
  const publicKey = new NodeRSA(publicKeyString, 'pkcs8-public');
  return publicKey.encrypt(plaintext, 'base64');
}
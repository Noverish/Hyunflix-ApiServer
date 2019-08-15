import { encrypt, decrypt } from './encryptor';
export * from './subtitle';

function sleep(millis: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    },         millis);
  });
}

export {
  sleep,
  encrypt,
  decrypt,
};

import { encrypt, decrypt } from './encryptor';

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

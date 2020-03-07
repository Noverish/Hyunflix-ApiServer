import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

import { TOKEN_KEY_PATH, TOKEN_ALGORITHM } from '@src/config';
import { TokenPayload } from '@src/models';

const publicKey = fs.readFileSync(TOKEN_KEY_PATH);

export function verifyToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithms: [TOKEN_ALGORITHM] }, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as TokenPayload);
      }
    });
  });
}

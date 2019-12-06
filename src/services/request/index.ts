import * as request from 'request';

import { AUTH_HEADER } from '@src/config';
import { Auth } from '@src/models';

export function validateToken(token: string): Promise<Auth> {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'GET',
      url: 'http://home.hyunsub.kim:8080/auth/validate-token',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    request(config, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const authString: string = res.headers[AUTH_HEADER].toString();
      resolve(JSON.parse(authString));
    });
  });
}

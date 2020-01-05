import * as request from 'request';

import { AUTH_HEADER } from '@src/config';
import { Session } from '@src/models';

export function validateSession(sessionId: string): Promise<Session> {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'GET',
      url: 'http://home.hyunsub.kim:8080/auth/validate-session',
      headers: {
        'x-hyunsub-session-id': `${sessionId}`,
      },
    };

    request(config, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }

      const sessionString: string = res.headers[AUTH_HEADER].toString();
      resolve(JSON.parse(sessionString));
    });
  });
}

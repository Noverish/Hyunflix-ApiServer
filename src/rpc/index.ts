import * as jayson from 'jayson';

import { RPC_SERVER_HOST, RPC_SERVER_PORT } from '@src/config';

const client = jayson.Client.http({
  host: RPC_SERVER_HOST,
  port: RPC_SERVER_PORT,
  timeout: 0,
});

export function call(functionName, args): Promise<any> {
  return new Promise((resolve, reject) => {
    client.request(functionName, args, (err, error, response) => {
      if (err) {
        reject(err);
      } else if (error) {
        reject(new Error(error.message));
      } else {
        resolve(response);
      }
    });
  });
}

export * from './ffprobe';
export * from './fs';
export * from './subtitle';
export * from './ffmpeg';
export * from './ffstate';
export * from './youtube';

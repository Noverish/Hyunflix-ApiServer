import * as request from 'request';

import { FFMPEG_HOST } from '@src/config';
import { FFProbeVideo } from '@src/models';

function send(url, method, payload = undefined): Promise<object> {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      method,
      json: payload,
    };

    request(options, (err: Error, res: request.Response, body: object) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(JSON.parse(body.toString()));
    });
  });
}

export async function ffprobeVideo(path: string): Promise<FFProbeVideo> {
  const url = `${FFMPEG_HOST}/ffprobe/video?path=${encodeURI(path)}`;
  const method = 'GET';

  return (await send(url, method)) as FFProbeVideo;
}

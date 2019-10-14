import * as request from 'request';

import { FFMPEG_HOST } from '@src/config';
import { FFProbeVideo, RawSubtitle, RawFile } from '@src/models';

function send(url, method, payload = undefined): Promise<object> {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      method,
      json: payload || true,
    };

    request(options, (err: Error, res: request.Response, body: object) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(body);
    });
  });
}

export async function ffprobeVideo(path: string): Promise<FFProbeVideo> {
  const url = `${FFMPEG_HOST}/ffprobe/video?path=${encodeURI(path)}`;
  const method = 'GET';

  return (await send(url, method)) as FFProbeVideo;
}

export async function subtitle(videoPath: string): Promise<RawSubtitle[]> {
  const url = `${FFMPEG_HOST}/subtitle`;
  const method = 'POST';
  const payload = { videoPath };
  return (await send(url, method, payload)) as RawSubtitle[];
}

export async function readdir(path: string): Promise<RawFile[]> {
  const url = `${FFMPEG_HOST}/fs/readdir?path=${encodeURI(path)}`;
  const method = 'GET';
  return (await send(url, method)) as RawFile[];
}

import * as request from 'request';

import { FFMPEG_HOST } from '@src/config';
import { FFProbeVideo, RawSubtitle, Stat } from '@src/models';
import { API_SERVER_KEY } from '@src/credentials';

function send(url, method, payload = undefined): Promise<object> {
  return new Promise((resolve, reject) => {
    const options = {
      url,
      method,
      headers: {
        'Authorization': `Bearer ${API_SERVER_KEY}`
      },
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

export async function readdir(path: string): Promise<Stat[]> {
  const url = `${FFMPEG_HOST}/fs/readdir?path=${encodeURI(path)}`;
  const method = 'GET';
  return (await send(url, method)) as Stat[];
}

export async function walk(path: string): Promise<string[]> {
  const url = `${FFMPEG_HOST}/fs/walk?path=${encodeURI(path)}`;
  const method = 'GET';
  return (await send(url, method)) as string[];
}

export async function access(path: string): Promise<{ error: string | null}> {
  const url = `${FFMPEG_HOST}/fs/access?path=${encodeURI(path)}`;
  const method = 'GET';
  return (await send(url, method)) as { error: string | null};
}

export async function stat(path: string): Promise<Stat> {
  const url = `${FFMPEG_HOST}/fs/stat?path=${encodeURI(path)}`;
  const method = 'GET';
  return (await send(url, method)) as Stat;
}

export async function statBulk(paths: string[]): Promise<Stat[]> {
  const url = `${FFMPEG_HOST}/fs/stat-bulk`;
  const method = 'POST';
  const payload = { paths };
  return (await send(url, method, payload)) as Stat[];
}

import * as EventSource from 'eventsource';

import { SSE_SERVER } from '@src/config';
import { FFMpegStatus } from '@src/models';
import { call } from '.';

const STATUS_EVENT = 'status';
const FINISH_EVENT = 'finish';
const ERROR_EVENT = 'error';

export async function ffmpeg(inpath: string, outpath: string, args: string[], callback: (status: FFMpegStatus) => void): Promise<void> {
  const pid: number = await call('ffmpeg', { inpath, outpath, args });
  await ffmpegProgress(pid, callback);
}

async function ffmpegProgress(pid: number, callback: (status: FFMpegStatus) => void) {
  return new Promise((resolve, reject) => {
    const es = new EventSource(`${SSE_SERVER}/ffmpeg/${pid}`);

    es.addEventListener(STATUS_EVENT, (event) => {
      const status: FFMpegStatus = JSON.parse(event.data);
      callback(status);
    });

    es.addEventListener(FINISH_EVENT, () => {
      es.close();
      resolve();
    });

    es.addEventListener(ERROR_EVENT, (event) => {
      reject(event);
    });
  });
}

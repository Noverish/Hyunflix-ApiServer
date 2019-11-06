import * as EventSource from 'eventsource';

import { FFMpegStatus } from '@src/models';
import { SSE_SERVER } from '@src/config';
import { call } from './';

export async function ffmpeg(args: string[], callback: (status: FFMpegStatus) => void): Promise<void> {
  const es = new EventSource(`${SSE_SERVER}/ffmpeg`);
  es.onmessage = (event: MessageEvent) => {
    callback(event.data);
  };

  await call('ffmpeg', { args });

  es.close();
}

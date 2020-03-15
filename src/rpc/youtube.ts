import * as EventSource from 'eventsource';

import { YoutubeStatus } from '@src/models';
import { SSE_SERVER } from '@src/config';
import { call } from '.';

export async function downloadYoutube(url: string, callback: (status: YoutubeStatus) => void): Promise<string | null> {
  const es = new EventSource(`${SSE_SERVER}/youtube`);
  es.onmessage = (event: MessageEvent) => {
    callback(JSON.parse(event.data));
  };

  const tmp = await call('downloadYoutube', { url });

  es.close();

  return tmp;
}

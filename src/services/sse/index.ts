import * as SSEStream from 'ssestream';
import { Request, Response } from 'express';

const streams = new Map<string, SSEStream[]>();

export function register(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Accel-Buffering', 'no');

  const stream = new SSEStream(req);
  stream.pipe(res);

  const path = decodeURI(req.originalUrl);

  if (streams.has(path)) {
    streams.set(path, [...streams.get(path), stream]);
  } else {
    streams.set(path, [stream]);
  }
}

export function send(path: string, data: string | object, event?: string) {
  if (streams.has(path)) {
    const arr: SSEStream[] = streams.get(path);
    arr.forEach(s => s.write({ data, event }));
  }
}

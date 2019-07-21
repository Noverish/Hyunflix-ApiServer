import * as fs from 'promise-fs';
import * as mime from 'mime';
import { Request, Response, NextFunction } from 'express';
import { extname, parse, join } from 'path';
import { createError, smi2vtt, srt2vtt } from '../../utils';

export default async function (path: string, req: Request, res: Response, next: NextFunction) {
  const ext = extname(path).toLowerCase();
  const type = mime.getType(ext);

  switch (ext) {
    case '.mp4':
      await mp4(req, res, path);
      break;
    case '.vtt':
      await vtt(req, res, path);
      break;
    case '.srt':
    case '.smi':
    case '.txt':
      await text(req, res, path);
      break;
    default:
      if (type) {
        await etc(req, res, path);
      } else {
        next(createError(400, 'Cannot open this type of file'));
      }
  }
}

async function mp4(req: Request, res: Response, path: string) {
  const stat = await fs.stat(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}

async function vtt(req: Request, res: Response, path: string) {
  const parsed = parse(path);
  const smiPath = join(parsed.dir, `${parsed.name}.smi`);
  const srtPath = join(parsed.dir, `${parsed.name}.srt`);
  const header = {
    'Content-Type': 'text/vtt; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };
  
  if(fs.existsSync(smiPath)) {
    res.writeHead(200, header);
    res.end(smi2vtt(smiPath));
  } else if(fs.existsSync(srtPath)) {
    res.writeHead(200, header);
    res.end(srt2vtt(srtPath));
  } else {
    res.status(404);
    res.end('Not Found');
  }
}

async function text(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };

  res.writeHead(200, header);
  file.pipe(res);
}

async function etc(req: Request, res: Response, path: string) {
  const ext = extname(path).toLowerCase();
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': mime.getType(ext),
    'Access-Control-Allow-Origin': '*',
  };

  res.writeHead(200, header);
  file.pipe(res);
}

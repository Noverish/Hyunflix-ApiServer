import * as fs from 'promise-fs';
import { Request, Response, NextFunction } from 'express';
import { extname } from 'path';
import { createError } from '../utils'

export default async function (path: string, req: Request, res: Response, next: NextFunction) {
  const ext = extname(path).toLowerCase();
  
  switch (ext) {
    case '.mp4':
      await mp4(req, res, path);
      break;
    case '.vtt':
      await vtt(req, res, path);
      break;
    case '.srt':
      await srt(req, res, path);
      break;
    case '.smi':
      await smi(req, res, path);
      break;
    case '.txt':
      await smi(req, res, path);
      break;
    case '.jpeg':
    case '.jpg':
      await jpg(req, res, path);
      break;
    default:
      next(createError(400, 'Cannot open this type of file'));
  }
}

async function mp4(req: Request, res: Response, path: string) {
  const stat = await fs.stat(path)
  const fileSize = stat.size
  const range = req.headers.range
  
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
}

async function vtt(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'text/vtt; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }
  
  res.writeHead(200, header)
  file.pipe(res);
}

async function srt(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'text/srt; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }
  
  res.writeHead(200, header)
  file.pipe(res);
}

async function txt(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  }
  
  res.writeHead(200, header)
  file.pipe(res);
}

async function smi(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'text/smi; charset=euc-kr',
    'Access-Control-Allow-Origin': '*'
  }
  
  res.writeHead(200, header)
  file.pipe(res);
}

async function jpg(req: Request, res: Response, path: string) {
  const file = fs.createReadStream(path);
  const header = {
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': '*'
  }
  
  res.writeHead(200, header)
  file.pipe(res);
}
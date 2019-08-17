import * as fs from 'promise-fs';
import { join, extname } from 'path';
import { Router, Request, Response, NextFunction } from 'express';

import raw from 'src/server-file/file';

import { getFileList, File, getVideoFromFilePath, Video } from 'src/fs';

const router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  process(req.baseUrl, req, res, next)
    .catch((err) => {
      next(err);
    });
});

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  process(join(req.baseUrl, decodeURIComponent(req.path)), req, res, next)
    .catch((err) => {
      next(err);
    });
});

async function process(path: string, req: Request, res: Response, next: NextFunction) {
  
  const ext = extname(path).toLowerCase();

  if (ext === '.vtt') {
    await raw(path, req, res, next);
    return;
  }

  try {
    await fs.access(path);
  } catch (err) {
    throw { status: 404, msg: 'Not Found' };
  }

  const stat = await fs.stat(path);
  if (stat.isDirectory()) {
    const files: File[] = await getFileList(path);
    res.render('explorer', { path, files });
    
  } else if (stat.isFile()) {
    if (!req.query.hasOwnProperty('raw')) {
      switch (ext) {
        case '.mp4': {
          const video: Video = await getVideoFromFilePath(path);
          console.log(video);
          res.render('video', video);
          return;
        }
        case '.mkv':
        case '.avi': {
          throw { status: 400, msg: '재생할 수 없는 비디오 포맷입니다' };
        }
      }
    }

    await raw(path, req, res, next);
  }
}

export default router;

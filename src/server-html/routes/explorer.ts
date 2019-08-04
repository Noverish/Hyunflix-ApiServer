import * as fs from 'promise-fs';
import { join, extname } from 'path';
import { File, Folder, Video } from '../models'
import { Router, Request, Response, NextFunction } from 'express';
import * as file from '../utils/file'
import raw from './raw'

const router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  process(req, res, req.baseUrl)
    .catch((err) => {
      next(err);
    });
})

router.get('/:path*', function(req: Request, res: Response, next: NextFunction) {
  process(req, res, join(req.baseUrl, decodeURIComponent(req.path)))
    .catch((err) => {
      next(err);
    });
});

async function process(req: Request, res: Response, path: string) {
  const ext = extname(path).toLowerCase();
  
  if (ext === '.vtt') {
    await raw(req, res, path);
    return;
  }
  
  try {
    await fs.access(path);
  } catch (err) {
    throw { status: 404, msg: 'Not Found' };
  }
  
  const stat = await fs.stat(path);
  if (stat.isDirectory()) {
    const files: File[] = await file.getFileList(path)
    const folder: Folder = {
      path: path,
      files: files
    }
    
    res.render('explorer', folder);
  } else if (stat.isFile()) {
    
    if(!req.query.hasOwnProperty('raw')) {
      switch (ext) {
        case '.mp4': {
          const video: Video = await file.getVideoInfo(path);
          res.render('video', video);
          return;
        }
        case '.mkv':
        case '.avi': {
          throw { status: 400, msg: '재생할 수 없는 비디오 포맷입니다' };
        }
      }
    }
    
    await raw(req, res, path);
  }
}



export default router;

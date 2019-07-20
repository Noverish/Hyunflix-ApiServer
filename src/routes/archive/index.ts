import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { createError } from '../../utils';

import file from './file';
import raw from './raw';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const response = {
    type: 'folder',
    path: '/archive',
    name: 'archive',
    ext: '',
    payload: [
      {
        name: 'Movies',
        type: 'folder',
        path: '/archive/Movies',
        isDir: true,
        size: null,
      },
      {
        name: 'TV_Series',
        type: 'folder',
        path: '/archive/TV_Series',
        isDir: true,
        size: null,
      },
      {
        name: 'Documentaries',
        type: 'folder',
        path: '/archive/Documentaries',
        isDir: true,
        size: null,
      },
      {
        name: 'torrents',
        type: 'folder',
        path: '/archive/torrents',
        isDir: true,
        size: null,
      },
    ],
  };

  res.end(JSON.stringify(response, null, 4));
});

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  process(req, res, next);
});

async function process(req: Request, res: Response, next: NextFunction) {
  const isRaw = req.query.hasOwnProperty('raw');
  const path = req['decodedPath'];
  
  console.log(req.query);
  console.log(isRaw);

  if (isRaw) {
    raw(path, req, res, next);
  } else {
    if (fs.existsSync(path)) {
      file(path, req, res, next);
    } else {
      next(createError(400, 'Not Exist'));
    }
  }
}

export default router;

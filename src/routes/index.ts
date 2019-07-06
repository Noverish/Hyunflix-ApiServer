import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { createError } from '../utils';

import processFile from './file';
import processRaw from './raw';

const router: Router = Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  process(req, res, next);
})

router.get('/:path*', function(req: Request, res: Response, next: NextFunction) {
  process(req, res, next);
});

async function process(req: Request, res: Response, next: NextFunction) {
  const isRaw = req.query.hasOwnProperty('raw');
  const path = req['decodedPath'];
  
  if (isRaw) {
    processRaw(path, req, res, next);
  } else {
    if (fs.existsSync(path)) {
      processFile(path, req, res, next);
    } else {
      next(createError(400, 'Not Exist'));
    }
  }
}

export default router;
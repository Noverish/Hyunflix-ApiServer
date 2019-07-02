import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as fs from 'promise-fs';
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
  
  try {
    await fs.access(path);
  } catch (err) {
    next(createError(400, 'Not Exist'));
  }
  
  if (isRaw) {
    processRaw(path, req, res, next);
  } else {
    processFile(path, req, res, next);
  }
}

export default router;
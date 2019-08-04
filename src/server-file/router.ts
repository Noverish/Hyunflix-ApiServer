import { Router, Request, Response, NextFunction } from 'express';

import file from './file';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200);
  res.end('File Server');
})

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  const path = decodeURI(req.path);
  
  file(path, req, res, next);
});

export default router;
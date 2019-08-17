import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';

import { readdir } from 'src/fs';
import { File } from 'src/models';

const router: Router = Router();

router.post('/readdir', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.body['path'];
    const files: File[] = await readdir(join('/archive', path));
    files.forEach((file:File) => {
      file.path = file.path.substring(8);
    });
    res.status(200);
    res.json(files);
  })().catch((err) => {
    next(err);
  });
});

export default router;

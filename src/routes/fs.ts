import { Router, Request, Response, NextFunction } from 'express';
import * as prettyBytes from 'pretty-bytes';

import { readdir } from '@src/api';
import { File, RawFile } from '@src/models';
import { checkAdmin } from '@src/middlewares/check-admin';
import { pathToURL } from '@src/utils';

const router: Router = Router();

router.get('/readdir', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.query['path'];

    const rawFiles: RawFile[] = await readdir(path);
    const files: File[] = rawFiles.map(f => ({
      url: pathToURL(f.path),
      path: f.path,
      name: f.name,
      isdir: f.isdir,
      size: prettyBytes(f.size),
    }));

    res.status(200);
    res.json(files);
  })().catch(next);
});

export default router;

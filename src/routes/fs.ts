import { Router, Request, Response, NextFunction } from 'express';
import * as prettyBytes from 'pretty-bytes';

import { readdir } from '@src/api';
import { File, Stat } from '@src/models';
import { checkAuthority } from '@src/middlewares/validate-header';
import { pathToURL } from '@src/utils';

const router: Router = Router();

router.get('/readdir', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.query['path'];

    const stats: Stat[] = await readdir(path);
    const files: File[] = stats.map(s => ({
      url: pathToURL(s.path),
      path: s.path,
      name: s.name,
      isdir: s.isdir,
      size: prettyBytes(s.size),
    }));

    res.status(200);
    res.json(files);
  })().catch(next);
});

export default router;

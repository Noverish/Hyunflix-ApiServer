import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as prettyBytes from 'pretty-bytes';

import { readdir, statBulk, rename } from '@src/rpc';
import { File, Stat } from '@src/models';
import { checkAuthority } from '@src/middlewares/validate-header';
import { pathToURL } from '@src/utils';

const router: Router = Router();

router.use(checkAuthority(256));

router.get('/readdir', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.query['path'];

    const paths: string[] = (await readdir(path)).map(f => join(path, f));
    const stats: Stat[] = await statBulk(paths);
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

router.post('/rename', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const from = req.body['from'];
    const to = req.body['to'];

    await rename(from, to);

    res.status(204);
    res.end();
  })().catch(next);
});

export default router;

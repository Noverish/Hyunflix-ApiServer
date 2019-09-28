import { Router, Request, Response, NextFunction } from 'express';

import { ARCHIVE_PATH } from '@src/config';
import { readdir, isdir, exists, rename } from '@src/fs';
import { File } from '@src/models';
import { checkAdmin } from '@src/middlewares/check-admin';

const router: Router = Router();

router.post('/readdir', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.body['path'];

    const files: File[] = await readdir(path, ARCHIVE_PATH);

    res.status(200);
    res.json(files);
  })().catch(next);
});

router.post('/rename', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const fromPath = req.body['fromPath'];
    const toPath = req.body['toPath'];

    await rename(fromPath, toPath, ARCHIVE_PATH);

    res.status(204);
    res.end();
  })().catch(next);
});

router.post('/isdir', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.body['path'];

    res.status(200);
    res.json({ isdir: await isdir(path, ARCHIVE_PATH) });
  })().catch(next);
});

router.post('/exists', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.body['path'];

    res.status(200);
    res.json({ exists: await exists(path, ARCHIVE_PATH) });
  })().catch(next);
});

export default router;

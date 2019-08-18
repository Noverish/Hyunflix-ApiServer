import { Router, Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

import { getFileList, File, getVideoFromFilePath, Video, isdir, exists } from '@src/fs';
const fsPromises = fs.promises;

const router: Router = Router();

router.post('/readdir', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const path = req.body['path'];
    const files: File[] = await getFileList(path);
    // files.forEach((file:File) => {
    //   file.path = file.path.substring(8);
    // });
    res.status(200);
    res.json(files);
  })().catch((err) => {
    next(err);
  });
});

router.post('/rename', (req: Request, res: Response, next: NextFunction) => {
  const fromPath = req.body['fromPath'];
  const toPath = req.body['toPath'];
    
  if(req['user_id'] !== 1) {
    res.status(403);
    res.json({ msg: '권한이 없습니다' })
  }
  
  (async function () {
    await fsPromises.rename(fromPath, toPath);
    res.status(204);
    res.end();
  })().catch((err) => {
    next(err);
  });
})

router.post('/video', (req: Request, res: Response, next: NextFunction) => {
  const path = req.body['path'];
  
  (async function() {
    const video: Video = await getVideoFromFilePath(path);
    res.status(200);
    res.json(video);
  })().catch((err) => {
    next(err);
  })
})

router.post('/isdir', (req: Request, res: Response, next: NextFunction) => {
  const path = req.body['path'];
  
  (async function() {
    res.status(200);
    res.json({ isdir: await isdir(path) });
  })().catch((err) => {
    next(err);
  })
})

router.post('/exists', (req: Request, res: Response, next: NextFunction) => {
  const path = req.body['path'];
  
  (async function() {
    res.status(200);
    res.json({ exists: await exists(path) });
  })().catch((err) => {
    next(err);
  })
})

export default router;

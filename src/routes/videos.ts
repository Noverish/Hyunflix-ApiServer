import { Router, Request, Response, NextFunction } from 'express';

import { Video } from '@src/entity';
import { IVideo, ISubtitle } from '@src/models';
import { findSubtitle } from '@src/fs';
import { checkAdmin } from '@src/middlewares/check-admin';
import videoExamine from '@src/workers/video-examine';

const router: Router = Router();

router.post('/examine', checkAdmin, (req: Request, res: Response, next: NextFunction) => {
  videoExamine();
  res.status(204);
  res.end();
});

router.get('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);

  (async function () {
    const video: Video | null = await Video.findById(videoId);

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const video2: IVideo = await video.convert();

    res.status(200);
    res.json(video2);
  })().catch(next);
});

router.get('/:videoId/subtitles', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);

  (async function () {
    const video: Video | null = await Video.findById(videoId);

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const subtitles: ISubtitle[] = await findSubtitle(video.path);

    res.status(200);
    res.json(subtitles);
  })().catch(next);
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';

import { pathToURL } from '@src/utils';
import { Video } from '@src/entity';
import { IVideo, ISubtitle, RawSubtitle } from '@src/models';
import { checkAdmin } from '@src/middlewares/check-admin';
import { subtitle } from '@src/api';
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

    const rawSubtitles: RawSubtitle[] = await subtitle(video.path);

    const subtitles: ISubtitle[] = rawSubtitles.map(s => ({
      language: s.language,
      url: pathToURL(s.path),
    }));

    res.status(200);
    res.json(subtitles);
  })().catch(next);
});

export default router;

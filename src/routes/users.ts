import { Router, Request, Response, NextFunction } from 'express';

import { UserVideo, Video } from '@src/entity';

const router: Router = Router();

const notFoundMsg = (userId, videoId) => `There is no UserVideo with userId=${userId} and videoId=${videoId}`;

router.get('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);

    const userVideos: UserVideo[] = await UserVideo.$find({ userId });

    res.status(200);
    res.json(userVideos.map(v => v.convert()));
  })().catch(next);
});

router.get('/:userId/videos/:videoId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const videoId: number = parseInt(req.params['videoId'], 10);

    const video: Video | undefined = await Video.findOne({ id: videoId });
    if (!video) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, videoId) });
      return;
    }

    const userVideo: UserVideo | undefined = await UserVideo.$findOne({ userId, video });
    if (!userVideo) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, videoId) });
      return;
    }

    res.status(200);
    res.json(userVideo.convert());
  })().catch(next);
});

router.delete('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const videoIds: number[] = req.body['videoIds'];

    for (const videoId of videoIds) {
      const video: Video | undefined = await Video.findOne({ id: videoId });
      if (!video) {
        res.status(404);
        res.json({ msg: notFoundMsg(userId, videoId) });
        return;
      }

      const userVideo: UserVideo | undefined = await UserVideo.$findOne({ userId, video });
      if (!userVideo) {
        res.status(404);
        res.json({ msg: notFoundMsg(userId, videoId) });
        return;
      }

      await userVideo.remove();
    }

    res.status(204);
    res.json();
  })().catch(next);
});

router.delete('/:userId/videos/:videoId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const videoId: number = parseInt(req.params['videoId'], 10);

    const video: Video | undefined = await Video.findOne({ id: videoId });
    if (!video) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, videoId) });
      return;
    }

    const userVideo: UserVideo | undefined = await UserVideo.$findOne({ userId, video });
    if (!userVideo) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, videoId) });
      return;
    }

    await userVideo.remove();
    res.status(204);
    res.json();
  })().catch(next);
});

export default router;

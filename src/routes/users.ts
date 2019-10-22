import { Router, Request, Response, NextFunction } from 'express';

import { UserVideo, VideoArticle } from '@src/entity';

const router: Router = Router();

router.get('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);

    const userVideos: UserVideo[] = await UserVideo.findAll(userId);

    res.status(200);
    res.json(userVideos.map(v => v.convert()));
  })().catch(next);
});

router.get('/:userId/videos/:articleId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const articleId: number = parseInt(req.params['articleId'], 10);

    const article: VideoArticle | null = await VideoArticle.findById(articleId);
    if (!article) {
      res.status(404);
      res.json({ msg: 'Not Found' });
    }

    const userVideo: UserVideo | null = await UserVideo.find(userId, article);
    if (!userVideo) {
      res.status(404);
      res.json({ msg: 'Not Found' });
    }

    res.status(200);
    res.json(userVideo);
  })().catch(next);
});

export default router;

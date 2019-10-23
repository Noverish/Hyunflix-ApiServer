import { Router, Request, Response, NextFunction } from 'express';

import { UserVideo, VideoArticle } from '@src/entity';

const router: Router = Router();

const notFoundMsg = (userId, articleId) => `There is no UserVideo with userId=${userId} and articleId=${articleId}`;

router.get('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);

    const userVideos: UserVideo[] = await UserVideo.$find({ userId });

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
      res.json({ msg: notFoundMsg(userId, articleId) });
      return;
    }

    const userVideo: UserVideo | null = await UserVideo.$findOne({ userId, article });
    if (!userVideo) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, articleId) });
      return;
    }

    res.status(200);
    res.json(userVideo.convert());
  })().catch(next);
});

router.delete('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const articleIds: number[] = req.body['articleIds'];

    for (const articleId of articleIds) {
      const article: VideoArticle | null = await VideoArticle.findById(articleId);
      if (!article) {
        res.status(404);
        res.json({ msg: notFoundMsg(userId, articleId) });
        return;
      }

      const userVideo: UserVideo | null = await UserVideo.$findOne({ userId, article });
      if (!userVideo) {
        res.status(404);
        res.json({ msg: notFoundMsg(userId, articleId) });
        return;
      }

      await userVideo.remove();
    }

    res.status(204);
    res.json();
  })().catch(next);
});

router.delete('/:userId/videos/:articleId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);
    const articleId: number = parseInt(req.params['articleId'], 10);

    const article: VideoArticle | null = await VideoArticle.findById(articleId);
    if (!article) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, articleId) });
      return;
    }

    const userVideo: UserVideo | null = await UserVideo.$findOne({ userId, article });
    if (!userVideo) {
      res.status(404);
      res.json({ msg: notFoundMsg(userId, articleId) });
      return;
    }

    await userVideo.remove();
    res.status(204);
    res.json();
  })().catch(next);
});

export default router;

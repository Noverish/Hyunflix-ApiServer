import { Router, Request, Response, NextFunction } from 'express';

import { UserVideo } from '@src/entity';

const router: Router = Router();

router.get('/:userId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const userId: number = parseInt(req.params['userId'], 10);

    const userVideos: UserVideo[] = await UserVideo.findAll(userId);

    res.status(200);
    res.json(userVideos.map(v => v.convert()));
  })().catch(next);
});

export default router;

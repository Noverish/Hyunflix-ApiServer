import { Router, Request, Response, NextFunction } from 'express';

import { Music } from '@src/entity';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  Music.findAll()
    .then((musics: Music[]) => {
      res.status(200);
      res.json(musics);
    })
    .catch((err) => {
      next(err);
    })
});

export default router;

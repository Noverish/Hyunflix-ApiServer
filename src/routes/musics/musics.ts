import { Router, Request, Response, NextFunction } from 'express';

import { Session } from '@src/models';
import { MusicService } from '@src/services';
import { handleServiceResult } from '@src/routes';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: Session = req['session'];

  MusicService.listMusic({ ...req.query, authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: Session = req['session'];

  MusicService.listMusicTags({ authority })
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

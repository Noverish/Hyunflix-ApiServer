import { Router, Request, Response, NextFunction } from 'express';

import { ComicService } from '@src/services';
import { Session } from '@src/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: Session = req['session'];

  ComicService.listComic({ ...req.query, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: Session = req['session'];

  ComicService.getComic({ ...req.params, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId/imgs', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: Session = req['session'];

  ComicService.listComicImg({ ...req.params, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

export default router;

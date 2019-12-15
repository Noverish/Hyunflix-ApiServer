import { Router, Request, Response, NextFunction } from 'express';

import { ComicService } from '@src/services';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  ComicService.listComic(req.body)
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId', (req: Request, res: Response, next: NextFunction) => {
  ComicService.getComic(req.params)
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId/imgs', (req: Request, res: Response, next: NextFunction) => {
  ComicService.listComicImg(req.params)
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

export default router;

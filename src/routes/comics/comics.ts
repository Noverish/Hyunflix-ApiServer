import { Router, Request, Response, NextFunction } from 'express';

import { ComicService } from '@src/services';
import { TokenPayload } from '@src/models';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  ComicService.listComic({ ...req.query, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  ComicService.getComic({ ...req.params, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.get('/:comicId/imgs', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  ComicService.listComicImg({ ...req.params, authority })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

export default router;

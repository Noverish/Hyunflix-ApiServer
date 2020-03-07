import { Router, Request, Response, NextFunction } from 'express';

import { TokenPayload } from '@src/models';
import { MusicService } from '@src/services';
import { handleServiceResult } from '@src/routes';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicService.listMusic({ ...req.query, authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicService.listMusicTags({ authority })
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

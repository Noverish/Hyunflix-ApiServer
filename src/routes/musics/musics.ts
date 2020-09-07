import { Router, Request, Response, NextFunction } from 'express';

import { TokenPayload } from '@src/models';
import { MusicService } from '@src/services';
import { handleServiceResult } from '@src/routes';
import { TOKEN_PAYLOAD_FIELD, ADMIN_AUTHORITY } from '@src/config';
import { checkAuthority } from '@src/middlewares';

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

router.use(checkAuthority(ADMIN_AUTHORITY));

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  MusicService.createMusic(req.body)
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

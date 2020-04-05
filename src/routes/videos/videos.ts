import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares';
import { TokenPayload } from '@src/models';
import { VideoService } from '@src/services';
import { handleServiceResult } from '@src/routes';
import { TOKEN_PAYLOAD_FIELD, ADMIN_AUTHORITY } from '@src/config';
import { ffprobeVideo } from '@src/rpc';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.listVideo({ ...req.query, authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.listVideoTags({ authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.getVideo({ ...req.params, authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/:videoId/subtitles', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.listVideoSubtitles({ ...req.params, authority })
    .then(handleServiceResult(res))
    .catch(next);
});

router.use(checkAuthority(ADMIN_AUTHORITY));

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  VideoService.createVideo(req.body)
    .then(handleServiceResult(res))
    .catch(next);
});

router.put('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  VideoService.updateVideo(req.params, req.body)
    .then(handleServiceResult(res))
    .catch(next);
});

router.post('/:videoId/examine', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.examineVideo({ ...req.params, authority }, ffprobeVideo)
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

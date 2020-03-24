import { Router, Request, Response, NextFunction } from 'express';

import { Video } from '@src/entity';
import { checkAuthority } from '@src/middlewares';
import { TokenPayload } from '@src/models';
import { VideoService } from '@src/services';
import { handleServiceResult } from '@src/routes';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';
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

router.use(checkAuthority(256));

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  VideoService.createVideo(req.body)
    .then(handleServiceResult(res))
    .catch(next);
});

router.put('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);
  const params: Partial<Video> = req.body;

  (async () => {
    const video: Video | undefined = await Video.findOne({ id: videoId });

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    await Video.update(videoId, params);

    res.status(204);
    res.json();
  })().catch(next);
});

router.post('/:videoId/examine', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  VideoService.examineVideo({ ...req.params, authority }, ffprobeVideo)
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

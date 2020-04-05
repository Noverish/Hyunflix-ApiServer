import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares';
import { EncodeService } from '@src/services';
import { handleServiceResult } from '@src/routes/utils';
import { ADMIN_AUTHORITY } from '@src/config';

const router: Router = Router();

router.use(checkAuthority(ADMIN_AUTHORITY));

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.createEncode(req.body)
    .then(handleServiceResult(200, res))
    .catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.listEncode(req.query)
    .then(handleServiceResult(200, res))
    .catch(next);
});

router.get('/:encodeId', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.getEncode(req.params.encodeId)
    .then(handleServiceResult(200, res))
    .catch(next);
});

router.put('/:encodeId', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.updateEncode(req.params.encodeId, req.body)
    .then(handleServiceResult(204, res))
    .catch(next);
});

router.post('/:encodeId/before', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.createEncodeResult(req.body)
    .then(result => EncodeService.updateEncode(req.params.encodeId, { beforeId: result.id }))
    .then(handleServiceResult(204, res))
    .catch(next);
});

router.post('/:encodeId/after', (req: Request, res: Response, next: NextFunction) => {
  EncodeService.createEncodeResult(req.body)
    .then(result => EncodeService.updateEncode(req.params.encodeId, { afterId: result.id }))
    .then(handleServiceResult(204, res))
    .catch(next);
});

router.get('/presets', (req: Request, res: Response, next: NextFunction) => {
  const presets = {
    default: '-c:v libx264 -c:a aac -map_chapters -1 -y',
    audio: '-c:v copy -c:a aac -map_chapters -1 -y',
    maxrate: '-c:v libx264 -b:v 2000k -maxrate 2000k -bufsize 4000k -vf scale=1280:-2 -c:a aac -map_chapters -1 -y',
  };

  res.status(200);
  res.json(presets);
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const msg = err.message;
  const matches = msg.match(/^\d{3}/);
  if (matches.length > 0) {
    res.status(parseInt(matches[0]));
    res.json({ msg });
  } else {
    console.error(err);
    res.status(500);
    res.json({ msg: err.stack });
  }
});

export default router;

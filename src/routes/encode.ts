import { Router, Request, Response, NextFunction } from 'express';

import { Encode } from '@src/entity';
import { presets } from '@src/utils/ffmpeg';

const router: Router = Router();

router.get('/presets', (req: Request, res: Response, next: NextFunction) => {
  res.status(200);
  res.json(presets);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const inpath = req.body['inpath'];
  const outpath = req.body['outpath'];
  const options = req.body['options'];

  Encode.insert(inpath, outpath, options)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/status', (req: Request, res: Response, next: NextFunction) => {
  Encode.findAll()
    .then((encodes: Encode[]) => {
      res.status(200);
      res.json(encodes);
    })
    .catch((err) => {
      next(err);
    });
});

export default router;

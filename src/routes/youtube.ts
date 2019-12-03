import { Router, Request, Response, NextFunction } from 'express';

import { YoutubeService, SSEService } from '@src/services';

const router: Router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  YoutubeService.start(req.body)
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    })
    .catch(next);
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  SSEService.register(req, res);
});

export default router;

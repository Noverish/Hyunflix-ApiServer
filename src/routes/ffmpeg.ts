import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares/validate-header';
import { ffmpegState, ffmpegPause, ffmpegResume } from '@src/rpc';

const router: Router = Router();

router.use(checkAuthority(256));

router.post('/pause', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    try {
      await ffmpegPause();
      res.status(204);
      res.end();
    } catch (err) {
      res.status(400);
      res.json({ msg: err.message });
    }
  })().catch(next);
});

router.post('/resume', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    try {
      await ffmpegResume();
      res.status(204);
      res.end();
    } catch (err) {
      res.status(400);
      res.json({ msg: err.message });
    }
  })().catch(next);
});

router.get('/state', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    try {
      const isRunning: boolean = await ffmpegState();
      res.status(200);
      res.json({ isRunning });
    } catch (err) {
      res.status(500);
      res.json({ msg: err.message });
    }
  })().catch(next);
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';

import { Encode } from '@src/entity';
import * as subprocess from '@src/utils/subprocess';

const router: Router = Router();

router.post('/file', (req: Request, res: Response, next: NextFunction) => {
  const target = req.body['target'];
  Encode.insert(target)
    .then(() => {
      res.status(204);
      res.end();
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/folder', (req: Request, res: Response, next: NextFunction) => {

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

router.post('/pause', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const pidStr = await subprocess.simple('pgrep', ['ffmpeg']);
    
    if(pidStr) {
      subprocess.simple('kill', ['-s', 'SIGSTOP', pidStr.trim()]);
      res.status(204);
      res.end();
    } else {
      res.status(404);
      res.json({ msg: 'ffmpeg 프로세스가 존재하지 않습니다' });
    }
  })().catch((err) => {
    next(err);
  })
});

router.post('/resume', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const pidStr = await subprocess.simple('pgrep', ['ffmpeg']);
    
    if(pidStr) {
      subprocess.simple('kill', ['-s', 'SIGCONT', pidStr.trim()]);
      res.status(204);
      res.end();
    } else {
      res.status(404);
      res.json({ msg: 'ffmpeg 프로세스가 존재하지 않습니다' });
    }
  })().catch((err) => {
    next(err);
  })
});

export default router;

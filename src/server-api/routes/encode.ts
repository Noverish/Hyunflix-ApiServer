import { Router, Request, Response, NextFunction } from 'express';

import { Encode } from '@src/entity';
import { presets } from '@src/utils/ffmpeg';
import * as subprocess from '@src/utils/subprocess';

const router: Router = Router();

router.get('/presets', (req: Request, res: Response, next: NextFunction) => {
  res.status(200);
  res.json(presets);
})

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

router.post('/pause', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const pidStr = await subprocess.exec('pgrep ffmpeg');
    
    if(!pidStr) {
      res.status(404);
      res.json({ msg: 'ffmpeg 프로세스가 존재하지 않습니다' });
      return;
    }
    
    const processState = await subprocess.exec(`ps -o state= -p ${pidStr}`);
    const isRunning = processState === 'S';
    
    if(isRunning) {
      await subprocess.exec(`kill -stop ${pidStr}`);
      res.status(204);
      res.end();
    } else {
      res.status(400);
      res.json({ msg: '이미 프로세스가 정지되어 있습니다' });
    }
  })().catch((err) => {
    next(err);
  })
});

router.post('/resume', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const pidStr = await subprocess.exec('pgrep ffmpeg');
    
    if(!pidStr) {
      res.status(404);
      res.json({ msg: 'ffmpeg 프로세스가 존재하지 않습니다' });
      return;
    }
    
    const processState = await subprocess.exec(`ps -o state= -p ${pidStr}`);
    const isStopped = processState === 'T';
    
    if(isStopped) {
      await subprocess.exec(`kill -cont ${pidStr}`);
      res.status(204);
      res.end();
    } else {
      res.status(400);
      res.json({ msg: '이미 프로세스가 실행중입니다' });
    }
  })().catch((err) => {
    next(err);
  })
});

export default router;

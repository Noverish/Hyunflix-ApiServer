import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';

import { Encode } from 'src/entity';

const router: Router = Router();

router.post('/file', (req: Request, res: Response, next: NextFunction) => {
  const target = req.body['target'];
  Encode.insert(target)
    .then(() => {
      console.log('success');
      res.status(204);
      res.end();
    })
    .catch((err) => {
      err['msg'] = 'ERROR';
      res.status(500);
      res.json(err);
    });
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {

});

router.get('/status', (req: Request, res: Response, next: NextFunction) => {
  Encode.findAll()
    .then((encodes: Encode[]) => {
      res.status(200);
      res.json(encodes);
    })
    .catch((err) => {
      err['msg'] = 'ERROR';
      res.status(500);
      res.json(err);
    });
});

router.get('/pause', (req: Request, res: Response, next: NextFunction) => {

});

router.get('/resume', (req: Request, res: Response, next: NextFunction) => {

});

export default router;

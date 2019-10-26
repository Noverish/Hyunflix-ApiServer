import { Router, Request, Response, NextFunction } from 'express';

import { Encode } from '@src/entity';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const encodes: Encode[] = await Encode.find({ order: { id: 'DESC' } });

    res.status(200);
    res.json(encodes.map(v => v.convert()));
  })().catch(next);
});

export default router;

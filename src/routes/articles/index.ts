import { Router, Request, Response, NextFunction } from 'express';

import videos from './videos';

const router: Router = Router();

router.use('/videos', videos);

export default router;

import { Router, Request, Response, NextFunction } from 'express';

import articles from './articles';
import encode from './encode';
import explorer from './explorer';
import musics from './musics';

const router: Router = Router();

router.use('/articles', articles);
router.use('/encode', encode);
router.use('/explorer', explorer);
router.use('/musics', musics);

export default router;

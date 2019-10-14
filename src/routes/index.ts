import { Router } from 'express';

import bundles from './bundles';
import articles from './articles';
import fs from './fs';
import musics from './musics';
import videos from './videos';
import users from './users';

const router: Router = Router();

router.use('/bundles', bundles);
router.use('/articles', articles);
router.use('/fs', fs);
router.use('/musics', musics);
router.use('/videos', videos);
router.use('/users', users);

export default router;

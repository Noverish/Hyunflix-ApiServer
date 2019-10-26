import { Router } from 'express';

import bundles from './bundles';
import articles from './articles';
import fs from './fs';
import musics from './musics';
import videos from './videos';
import users from './users';
import encodes from './encodes';

const router: Router = Router();

router.use('/bundles', bundles);
router.use('/articles', articles);
router.use('/fs', fs);
router.use('/musics', musics);
router.use('/videos', videos);
router.use('/users', users);
router.use('/encodes', encodes);

export default router;

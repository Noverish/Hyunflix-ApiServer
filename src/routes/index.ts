import { Router } from 'express';

import videoSeries from './videos/video-series';
import videos from './videos/videos';
import fs from './fs';
import musics from './musics';
import users from './users';
import encodes from './encodes';

const router: Router = Router();

router.use('/videos/series', videoSeries);
router.use('/videos', videos);
router.use('/musics', musics);
router.use('/fs', fs);
router.use('/users', users);
router.use('/encodes', encodes);

export default router;

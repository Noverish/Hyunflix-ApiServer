import { Router } from 'express';

import videoSeries from './videos/video-series';
import videos from './videos/videos';
import fs from './fs';
import musics from './musics';
import userVideos from './user/user-videos';
import encodes from './encodes';
import ffmpeg from './ffmpeg';

const router: Router = Router();

router.use('/videos/series', videoSeries);
router.use('/videos', videos);
router.use('/musics', musics);
router.use('/fs', fs);
router.use('/user/videos', userVideos);
router.use('/encodes', encodes);
router.use('/ffmpeg', ffmpeg);

export default router;

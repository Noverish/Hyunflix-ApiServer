import { Router, Request, Response, NextFunction } from 'express';

import { ARCHIVE_PATH } from '@src/config';
import { TVProgram, Video as VideoEntity } from '@src/entity';
import { getVideoFromFilePath, Video } from '@src/fs';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  TVProgram.findAllSeries()
    .then((series: string[]) => {
      res.status(200);
      res.json(series);
    })
    .catch((err) => {
      next(err);
    })
});

router.get('/:seriesName', (req: Request, res: Response, next: NextFunction) => {
  const seriesName: string = req.params['seriesName'];
  
  TVProgram.findAllEpisode(seriesName)
    .then((programs: TVProgram[]) => {
      res.status(200);
      res.json(programs);
    })
    .catch((err) => {
      next(err);
    })
});

router.get('/:seriesName/:episodeNumber', (req: Request, res: Response, next: NextFunction) => {
  const seriesName: string = req.params['seriesName'];
  const episodeNumber: number = parseInt(req.params['episodeNumber']);
  // TODO 숫자가 아닐 경우 대처

  (async function() {
    const tvProgram: TVProgram | null = await TVProgram.findByEpisodeNumber(seriesName, episodeNumber);
    const videoEntity: VideoEntity | null = await VideoEntity.findById(tvProgram.videoId);
    
    if (tvProgram && videoEntity) { // TODO replace 지우기
      const video: Video = await getVideoFromFilePath(videoEntity.path.replace('/archive', ''), ARCHIVE_PATH);
      video.title = tvProgram.episodeName;
      
      res.status(200);
      res.json(video);
    } else {
      res.status(404);
      res.json({ msg: 'Not Found' });
    }
  })().catch(err => {
    next(err);
  })
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';

import { ARCHIVE_PATH } from '@src/config';
import { MovieDetail } from '@src/entity';
import { getVideoFromFilePath, Video } from '@src/fs';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  MovieDetail.findAll()
    .then((movies: MovieDetail[]) => {
      res.status(200);
      res.json(movies);
    })
    .catch((err) => {
      next(err);
    })
});

router.get('/:movie_id', (req: Request, res: Response, next: NextFunction) => {
  const movieId: number = parseInt(req.params['movie_id']);
  // TODO 숫자가 아닐 경우 대처

  (async function() {
    const movie: MovieDetail | null = await MovieDetail.findById(movieId);
    
    if (movie) {
      const video: Video = await getVideoFromFilePath(movie.path, ARCHIVE_PATH);
      video.title = movie.title;
      
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

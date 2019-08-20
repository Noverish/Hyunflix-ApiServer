import { Router, Request, Response, NextFunction } from 'express';
import { join } from 'path';

import { Movie } from '@src/entity';
import { getVideoFromDirPath, Video } from '@src/fs';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  Movie.get()
    .then((movies: Movie[]) => {
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
    const movie: Movie | null = await Movie.findById(movieId);
    
    if (movie) {
      const video: Video = await getVideoFromDirPath(movie.path);
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

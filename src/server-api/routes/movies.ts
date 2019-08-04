import { Router, Request, Response, NextFunction } from 'express';
import { Movie } from 'src/entity';
import { movieDetail } from 'src/fs';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  Movie.get()
    .then((movies: Movie[]) => {
      res.status(200);
      res.json(movies);
    })
});

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  const path = decodeURI(req.path);
  
  Movie.findByPath(path)
    .then((movie: Movie | null) => {
      if(movie) {
        res.status(200);
        res.json(movieDetail(movie));
      } else {
        res.status(404);
        res.json({ msg: 'Not Found' })
      }
    })
})

export default router;
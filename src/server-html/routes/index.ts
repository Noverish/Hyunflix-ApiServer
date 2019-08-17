import { Router, Request, Response, NextFunction } from 'express';
import explorer from './explorer';
import login from './login';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index');
});

router.use('/login', login);
router.use('/archive/Movies', explorer);
router.use('/archive/TV_Programs', explorer);
router.use('/archive/Documentaries', explorer);
router.use('/archive/torrents', explorer);

export default router;

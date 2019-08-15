import { Router, Request, Response, NextFunction } from 'express';
import explorer from './explorer';
import login from './login';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index');
});

router.use('/login', LoginRouter);
router.use('/archive/Movies', ExplorerRouter);
router.use('/archive/TV_Programs', ExplorerRouter);
router.use('/archive/Documentaries', ExplorerRouter);
router.use('/archive/torrents', ExplorerRouter);

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import ExplorerRouter from './explorer'
import LoginRouter from './login'

const router: Router = Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index');
});

router.use('/login', LoginRouter)
router.use('/archive/Movies', ExplorerRouter);
router.use('/archive/TV_Series', ExplorerRouter);
router.use('/archive/torrents', ExplorerRouter);

export default router;
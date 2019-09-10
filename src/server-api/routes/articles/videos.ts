import { Router, Request, Response, NextFunction } from 'express';

import { VideoArticleView } from '@src/entity';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const articles = await VideoArticleView.findAll();
    
    res.status(200);
    res.json(articles);
  })().catch(err => next(err));
})

export default router;

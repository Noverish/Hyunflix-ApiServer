import { Router, Request, Response, NextFunction } from 'express';

import { VideoArticle } from '@src/entity';
import { IVideoArticle } from '@src/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const articles: VideoArticle[] = await VideoArticle.findAll();
    const articles2: IVideoArticle[] = await Promise.all(articles.map(a => a.convert()));
    
    res.status(200);
    res.json(articles2);
  })().catch(next);
})

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const tags: string[] = await VideoArticle.findTags();
    res.status(200);
    res.json(tags);
  })().catch(next);
});

router.get('/:articleId', (req: Request, res: Response, next: NextFunction) => {
  const articleId: number = parseInt(req.params['articleId']);
  
  (async function() {
    const article: VideoArticle | null = await VideoArticle.findById(articleId);
    
    if (!article) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }
    
    const article2: IVideoArticle = await article.convert();
    
    res.status(200);
    res.json(article2);
  })().catch(next);
})

export default router;

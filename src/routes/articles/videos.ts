import { Router, Request, Response, NextFunction } from 'express';

import { VideoArticle } from '@src/entity';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const articles: VideoArticle[] = await VideoArticle.findAll();
    // TODO Check authority

    res.status(200);
    res.json(articles.map(a => a.convert()));
  })().catch(next);
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const articles: VideoArticle[] = await VideoArticle.findAll();
    // TODO Check authority

    const tagSet = new Set();
    articles.forEach(m => m.tags.split(',').reduce((s, t) => s.add(t), tagSet));

    res.status(200);
    res.json([...tagSet]);
  })().catch(next);
});

router.get('/:articleId', (req: Request, res: Response, next: NextFunction) => {
  const articleId: number = parseInt(req.params['articleId'], 10);

  (async function () {
    const article: VideoArticle | null = await VideoArticle.findById(articleId);

    if (!article) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    res.status(200);
    res.json(article.convert());
  })().catch(next);
});

export default router;

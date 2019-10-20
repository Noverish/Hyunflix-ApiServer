import { Router, Request, Response, NextFunction } from 'express';

import { VideoArticle } from '@src/entity';
import { checkAuthority } from '@src/middlewares/validate-header';
import searchVideo from '@src/workers/search-video';
import { IVideoArticle } from '@src/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const query: string = req.query['q'];
    const page: number = parseInt(req.query['p'], 10);
    const pageSize: number = parseInt(req.query['ps'], 10);

    const tmp: VideoArticle[] = await VideoArticle.findAll();
    const articles: IVideoArticle[] = tmp.map(a => a.convert());

    const searched = (query)
      ? searchVideo(articles, query)
      : articles;

    const sliced = searched.slice((page - 1) * pageSize, (page) * pageSize);

    // TODO Check authority

    res.status(200);
    res.json({
      total: searched.length,
      results: sliced,
    });
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

router.put('/:articleId', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
  const articleId: number = parseInt(req.params['articleId'], 10);
  const params: Partial<VideoArticle> = req.body;

  (async function () {
    const article: VideoArticle | null = await VideoArticle.findById(articleId);

    if (!article) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    await VideoArticle.update(articleId, params);

    res.status(204);
    res.json();
  })().catch(next);
});

export default router;

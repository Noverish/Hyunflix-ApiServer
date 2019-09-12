import { Router, Request, Response, NextFunction } from 'express';
import { join, relative } from 'path';

import { VideoArticleView } from '@src/entity';
import { fs } from '@src/utils';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const articles: VideoArticleView[] = await VideoArticleView.findAll();
    
    articles.forEach(v => process(v));
    
    res.status(200);
    res.json(articles);
  })().catch(err => next(err));
})

router.get('/:articleId', (req: Request, res: Response, next: NextFunction) => {
  const articleId: number = parseInt(req.params['articleId']);
  
  (async function() {
    const article: VideoArticleView | null = await VideoArticleView.findById(articleId);
    
    if (!article) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }
    
    const tmp: fs.Subtitle[] = await fs.findSubtitle(join(ARCHIVE_PATH, article.path));
    const subtitles = tmp.map(s => ({
      language: s.language,
      url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, s.path),
    }))
    
    process(article);
    res.status(200);
    res.json({ article, subtitles });
  })().catch(err => next(err));
})

export default router;

function process(article: VideoArticleView) {
  article['url'] = FILE_SERVER + '/' + relative(ARCHIVE_PATH, article.path);
  delete article['path'];
}
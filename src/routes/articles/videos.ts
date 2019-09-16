import { Router, Request, Response, NextFunction } from 'express';
import { join, relative } from 'path';

import { VideoArticleView } from '@src/entity';
import * as fs from '@src/utils/fs';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';
import { dateToString } from '@src/utils/date';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function() {
    const articles: VideoArticleView[] = await VideoArticleView.findAll();
    
    res.status(200);
    res.json(articles.map(a => processArticle(a)));
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
    
    const subtitles: fs.Subtitle[] = await fs.findSubtitle(join(ARCHIVE_PATH, article.path));
    
    res.status(200);
    res.json({
      article: processArticle(article),
      subtitles: subtitles.map(s => processSubtitle(s))
    });
  })().catch(err => next(err));
})

export default router;

function processArticle(article: VideoArticleView) {
  const tmp = {
    ...article,
    url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, article.path),
    date: dateToString(article.date),
  }
  delete tmp['path'];
  return tmp;
}

function processSubtitle(subtitle: fs.Subtitle) {
  return {
    language: subtitle.language,
    url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, subtitle.path),
  }
}
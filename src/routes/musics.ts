import { Router, Request, Response, NextFunction } from 'express';

import { Music } from '@src/entity';
import { FILE_SERVER } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const authority: string[] = req['authority'];

  Music.findAll()
    .then((musics: Music[]) => {
      let musics2 = musics;
      if (authority.indexOf('admin') < 0) {
        musics2 = musics.filter(m => (m.authority === '') || m.authority.split(',').every(a => authority.indexOf(a) >= 0));
      }

      res.status(200);
      res.json(musics2.map(m => m.convert()));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const tags: string[] = await Music.findTags();
    const tagSet = new Set();

    tags.forEach((t1) => {
      t1.split(',').forEach(t2 => tagSet.add(t2));
    });

    res.status(200);
    res.json([...tagSet]);
  })().catch(next);
});

export default router;

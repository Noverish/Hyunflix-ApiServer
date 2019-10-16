import { Router, Request, Response, NextFunction } from 'express';

import { Music } from '@src/entity';
import { filterWithAuthority } from '@src/utils/authority';
import { checkFFMpeg } from '@src/middlewares/check-admin';
import { IMusic } from '@src/models';
import searchMusic from '@src/workers/search-music';

const router: Router = Router();

// TODO property-validator
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const query: string = req.query['q'] || '';
    const page: number = parseInt(req.query['p'] || '1', 10);
    const pageSize: number = parseInt(req.query['ps'] || '0', 10);
    const authority: string[] = req['authority'];

    const tmp: Music[] = await Music.findAll();
    const tmp2 = filterWithAuthority(authority, tmp);
    const musics: IMusic[] = tmp.map(m => m.convert());

    const searched = (query)
      ? searchMusic(musics, query)
      : musics;

    const sliced = (pageSize)
      ? searched.slice((page - 1) * pageSize, (page) * pageSize)
      : searched;

    res.status(200);
    res.json({
      total: searched.length,
      results: sliced,
    });
  })().catch(next);
});

router.post('/', checkFFMpeg, (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const title: string = req.body['title'];
    const path: string = req.body['path'];
    const duration: number = req.body['duration'];
    const youtube: string | null = req.body['youtube'];
    const tags: string[] = req.body['tags'];
    const authority: string[] = req.body['authority'];

    await Music.insert({
      title,
      path,
      duration,
      youtube,
      tags: tags.join(','),
      authority: authority.join(','),
    });

    res.status(204);
    res.end();
  })().catch(next);
});

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const authority: string[] = req['authority'];

    let musics: Music[] = await Music.findAll();
    musics = filterWithAuthority(authority, musics);

    const tagSet = new Set();
    musics.forEach(m => m.tags.split(',').reduce((s, t) => s.add(t), tagSet));

    res.status(200);
    res.json([...tagSet]);
  })().catch(next);
});

export default router;

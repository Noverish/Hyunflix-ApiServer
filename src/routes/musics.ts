import { Router, Request, Response, NextFunction } from 'express';

import { Music } from '@src/entity';
import { filterWithAuthority } from '@src/utils/authority';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const authority: string[] = req['authority'];

    let musics = await Music.findAll();
    musics = filterWithAuthority(authority, musics);

    res.status(200);
    res.json(musics.map(m => m.convert()));
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

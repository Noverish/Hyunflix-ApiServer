import { Router, Request, Response, NextFunction } from 'express';

import { Music } from '@src/entity';
import { filterWithAuthority } from '@src/utils/authority';
import { checkAuthority } from '@src/middlewares/validate-header';
import { IMusic, Auth } from '@src/models';
import searchMusic from '@src/workers/search-music';
import examineMusic from '@src/workers/examine-music';
import downloadMusic from '@src/workers/download-music';
import { unlinkBulk } from '@src/rpc';

const router: Router = Router();

// TODO property-validator
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const auth: Auth = req['auth'];
    const query: string = req.query['q'] || '';
    const page: number = parseInt(req.query['p'] || '1', 10);
    const pageSize: number = parseInt(req.query['ps'] || '0', 10);

    const tmp: Music[] = await Music.find({ order: { id: 'DESC' } });
    const tmp2 = filterWithAuthority(auth, tmp);
    const musics: IMusic[] = tmp2.map(m => m.convert());

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

router.get('/tags', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const auth: Auth = req['auth'];

    let musics: Music[] = await Music.find();
    musics = filterWithAuthority(auth, musics);

    const tagSet = new Set();
    musics.forEach(m => m.tags.split(',').reduce((s, t) => s.add(t), tagSet));

    res.status(200);
    res.json([...tagSet]);
  })().catch(next);
});

router.post('/download-youtube', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const url: string = req.body['url'];
    const tags: string[] = req.body['tags'];

    downloadMusic(url, tags);

    res.status(204);
    res.end();
  })().catch(next);
});

router.post('/examine', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
  examineMusic();
  res.status(204);
  res.end();
});

router.post('/', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
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

router.delete('/', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const ids: number[] = req.body['ids'];
    const deleteFile: boolean = req.body['deleteFile'];

    if (deleteFile) {
      const musics: Music[] = await Music.findByIds(ids);
      const paths: string[] = musics.map(m => m.path);

      await unlinkBulk(paths);
    }

    await Music.delete(ids);

    res.status(204);
    res.end();
  })().catch(next);
});

export default router;

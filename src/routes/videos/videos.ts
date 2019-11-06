import { Router, Request, Response, NextFunction } from 'express';

import { pathToURL } from '@src/utils';
import { Video } from '@src/entity';
import { checkAuthority } from '@src/middlewares/validate-header';
import searchVideo from '@src/workers/search-video';
import { IVideo, RawSubtitle, ISubtitle } from '@src/models';
import { subtitle } from '@src/rpc';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const query: string = req.query['q'];
    const page: number = parseInt(req.query['p'], 10);
    const pageSize: number = parseInt(req.query['ps'], 10);

    const videoEntities: Video[] = await Video.find({ order: { id: 'DESC' } });
    const videos: IVideo[] = videoEntities.map(v => v.convert());

    const searched = (query)
      ? searchVideo(videos, query)
      : videos;

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
    const videos: Video[] = await Video.find();
    // TODO Check authority

    const tagSet = new Set();
    videos.forEach(m => m.tags.split(',').reduce((s, t) => s.add(t), tagSet));

    res.status(200);
    res.json([...tagSet]);
  })().catch(next);
});

router.get('/:videoId', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);

  (async function () {
    const video: Video | undefined = await Video.findOne({ id: videoId });

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    res.status(200);
    res.json(video.convert());
  })().catch(next);
});

router.get('/:videoId/subtitles', (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);

  (async function () {
    const video: Video | undefined = await Video.findOne({ id: videoId });

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const rawSubtitles: RawSubtitle[] = await subtitle(video.path);

    const subtitles: ISubtitle[] = rawSubtitles.map(s => ({
      language: s.language,
      url: pathToURL(s.path),
    }));

    res.status(200);
    res.json(subtitles);
  })().catch(next);
});

router.put('/:videoId', checkAuthority('admin'), (req: Request, res: Response, next: NextFunction) => {
  const videoId: number = parseInt(req.params['videoId'], 10);
  const params: Partial<Video> = req.body;

  (async function () {
    const video: Video | undefined = await Video.findOne({ id: videoId });

    if (!video) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    await Video.update(videoId, params);

    res.status(204);
    res.json();
  })().catch(next);
});

export default router;

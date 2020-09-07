import { Router, Request, Response, NextFunction } from 'express';

import { VideoSeries, Video } from '@src/entity';
import { IVideoSeries, IVideo, TokenPayload } from '@src/models';
import { FindConditions, Raw } from 'typeorm';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  (async () => {
    const query: string = req.query['q'] || '';
    const page: number = parseInt(req.query['p'] || '1', 10);
    const pageSize: number = parseInt(req.query['ps'] || '0', 10);

    const where: FindConditions<Video> = {
      authority: Raw(`${authority} & VideoSeries.authority`),
    };

    const tmp: VideoSeries[] = await VideoSeries.$find(where, {
      order: { id: 'DESC' },
    });
    const items: IVideoSeries[] = tmp.map(s => s.convert());

    const searched = (query)
      ? items.filter(i => i.title.includes(query))
      : items;

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

router.get('/:seriesId', (req: Request, res: Response, next: NextFunction) => {
  const { authority }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  (async () => {
    const seriesId: number = parseInt(req.params['seriesId'], 10);

    const series: VideoSeries | null = await VideoSeries.$findOne({ id: seriesId });

    if (!series) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    series.videos = series.videos.filter(v => v.authority === (authority & v.authority));

    res.status(200);
    res.json(series.convert());
  })().catch(next);
});

router.get('/:seriesId/videos', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const seriesId: number = parseInt(req.params['seriesId'], 10);
    const query: string = req.query['q'] || '';
    const page: number = parseInt(req.query['p'] || '1', 10);
    const pageSize: number = parseInt(req.query['ps'] || '0', 10);

    const series: VideoSeries | null = await VideoSeries.$findOne({ id: seriesId });

    if (!series) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    const tmp: Video[] = series.videos;
    const items: IVideo[] = tmp.map(v => v.convert());

    const searched = (query)
      ? items.filter(i => i.title.includes(query))
      : items;

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

export default router;

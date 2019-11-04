import { Router, Request, Response, NextFunction } from 'express';

import { VideoSeries } from '@src/entity';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const series: VideoSeries[] = await VideoSeries.find();

    res.status(200);
    res.json(series.map(s => s.convert()));
  })().catch(next);
});

router.get('/:seriesId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const seriesId: number = parseInt(req.params['seriesId'], 10);

    const series: VideoSeries | null = await VideoSeries.findOne({ id: seriesId });

    if (!series) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    res.status(200);
    res.json(series.convert());
  })().catch(next);
});

export default router;

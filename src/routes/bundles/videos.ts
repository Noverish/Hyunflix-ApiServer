import { Router, Request, Response, NextFunction } from 'express';

import { VideoBundle } from '@src/entity';

const router: Router = Router();

router.get('/categories', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const categories: string[] = await VideoBundle.findAllCategories();

    res.status(200);
    res.json(categories);
  })().catch(next);
});

router.get('/:category', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const category: string = req.params['category'];

    const bundles: VideoBundle[] = await VideoBundle.findByCategory(category);

    res.status(200);
    res.json(bundles.map(b => b.convert()));
  })().catch(next);
});

router.get('/:category/:bundleId', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const category: string = req.params['category'];
    const bundleId: number = parseInt(req.params['bundleId'], 10);

    const bundle: VideoBundle | null = await VideoBundle.findByCategoryAndId(category, bundleId);

    if (!bundle) {
      res.status(404);
      res.json({ msg: 'Not Found' });
      return;
    }

    res.status(200);
    res.json(bundle.convert());
  })().catch(next);
});

export default router;

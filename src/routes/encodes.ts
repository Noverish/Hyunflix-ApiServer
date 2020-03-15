import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares';
import { Encode } from '@src/entity';
import { IEncode } from '@src/models';

const router: Router = Router();

router.use(checkAuthority(256)); // TODO number

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const query: string = req.query['q'] || '';
    const page: number = parseInt(req.query['p'] || '1', 10);
    const pageSize: number = parseInt(req.query['ps'] || '0', 10);

    const tmp: Encode[] = await Encode.find({ order: { id: 'DESC' } });
    const items: IEncode[] = tmp.map(m => m.convert());

    const searched = (query)
      ? items.filter(i => i.inpath.includes(query))
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

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    const { inpath, outpath, options } = req.body;

    await Encode.insert({ inpath, outpath, options });

    res.status(204);
    res.end();
  })().catch(next);
});

router.get('/presets', (req: Request, res: Response, next: NextFunction) => {
  const presets = {
    default: '-c:v libx264 -c:a aac -map_chapters -1 -y',
    audio: '-c:v copy -c:a aac -map_chapters -1 -y',
    maxrate: '-c:v libx264 -b:v 2000k -maxrate 2000k -bufsize 4000k -vf scale=1280:-2 -c:a aac -map_chapters -1 -y',
  };

  res.status(200);
  res.json(presets);
});

export default router;

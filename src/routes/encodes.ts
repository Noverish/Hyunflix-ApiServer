import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares/validate-header';
import { Encode } from '@src/entity';
import { IEncode } from '@src/models';

const router: Router = Router();

router.use(checkAuthority(256));

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
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
  (async function () {
    const inpath = req.body['inpath'];
    const outpath = req.body['outpath'];
    const options = req.body['options'];

    await Encode.insert({ inpath, outpath, options });

    res.status(204);
    res.end();
  })().catch(next);
});

router.get('/presets', (req: Request, res: Response, next: NextFunction) => {
  const presets = {
    pass1: '-c:v libx264 -b:v 2000k -pass 1 -vf scale=1280:-2 -map_chapters -1 -f mp4 -an -y',
    pass2: '-c:v libx264 -b:v 2000k -pass 2 -vf scale=1280:-2 -c:a aac -b:a 128k -ac 2 -map_chapters -1 -y',
    mkv2mp4: '-c:v copy -c:a aac -b:a 128k -ac 2 -map_chapters -1 -y',
    maxrate: '-c:v libx264 -b:v 2000k -maxrate 2000k -bufsize 4000k -vf scale=1280:-2 -c:a aac -b:a 128k -ac 2 -map_chapters -1 -y',
  };

  res.status(200);
  res.json(presets);
});

export default router;

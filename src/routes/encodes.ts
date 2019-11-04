import { Router, Request, Response, NextFunction } from 'express';

import { checkAuthority } from '@src/middlewares/validate-header';
import { Encode } from '@src/entity';

const router: Router = Router();

router.use(checkAuthority('admin'));

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  (async function () {
    const encodes: Encode[] = await Encode.find({ order: { id: 'DESC' } });

    res.status(200);
    res.json(encodes.map(v => v.convert()));
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

import { Router, Request, Response, NextFunction } from 'express';

import { MusicPlaylistService } from '@src/services';
import { Session } from '@src/models';
import { handleServiceResult } from '@src/routes';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: Session = req['session'];

  MusicPlaylistService.listPlaylist({ userId })
    .then(handleServiceResult(res))
    .catch(next);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: Session = req['session'];

  MusicPlaylistService.createPlaylist({ userId, ...req.body })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: Session = req['session'];

  MusicPlaylistService.getPlaylist({ userId, ...req.params })
    .then(handleServiceResult(res))
    .catch(next);
});

router.put('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: Session = req['session'];

  MusicPlaylistService.updatePlaylist({ userId, ...req.params, ...req.body })
    .then(handleServiceResult(res))
    .catch(next);
});

router.delete('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: Session = req['session'];

  MusicPlaylistService.deletePlaylist({ userId, ...req.params })
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

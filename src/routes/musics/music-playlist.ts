import { Router, Request, Response, NextFunction } from 'express';

import { MusicPlaylistService } from '@src/services';
import { Auth } from '@src/models';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req['auth'] as Auth;

  MusicPlaylistService.listPlaylist({ userId })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req['auth'] as Auth;

  MusicPlaylistService.createPlaylist({ userId, ...req.body })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.put('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req['auth'] as Auth;

  MusicPlaylistService.updatePlaylist({ userId, ...req.params, ...req.body })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

router.delete('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req['auth'] as Auth;

  MusicPlaylistService.deletePlaylist({ userId, ...req.params })
    .then(([status, response]) => {
      res.status(status);
      res.json(response);
    }).catch(next);
});

export default router;

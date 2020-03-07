import { Router, Request, Response, NextFunction } from 'express';

import { MusicPlaylistService } from '@src/services';
import { TokenPayload } from '@src/models';
import { handleServiceResult } from '@src/routes';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicPlaylistService.listPlaylist({ userId })
    .then(handleServiceResult(res))
    .catch(next);
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicPlaylistService.createPlaylist({ userId, ...req.body })
    .then(handleServiceResult(res))
    .catch(next);
});

router.get('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicPlaylistService.getPlaylist({ userId, ...req.params })
    .then(handleServiceResult(res))
    .catch(next);
});

router.put('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicPlaylistService.updatePlaylist({ userId, ...req.params, ...req.body })
    .then(handleServiceResult(res))
    .catch(next);
});

router.delete('/:playlistId', (req: Request, res: Response, next: NextFunction) => {
  const { userId }: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  MusicPlaylistService.deletePlaylist({ userId, ...req.params })
    .then(handleServiceResult(res))
    .catch(next);
});

export default router;

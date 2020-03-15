import { Request, Response, NextFunction } from 'express';

import { TokenPayload } from '@src/models';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

export default (userId: number) => (req: Request, res: Response, next: NextFunction) => {
  const payload: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

  if (payload.userId !== userId) {
    res.status(403);
    res.json({ msg: 'Forbidden' });
  } else {
    next();
  }
};

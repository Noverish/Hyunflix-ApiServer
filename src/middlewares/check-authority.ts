import { Request, Response, NextFunction } from 'express';

import { TokenPayload } from '@src/models';
import { authorityCheck } from '@src/utils';
import { TOKEN_PAYLOAD_FIELD } from '@src/config';

export default function (authority: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const payload: TokenPayload = req[TOKEN_PAYLOAD_FIELD];

    if (authorityCheck(payload.authority, authority)) {
      res.status(403);
      res.json({ msg: 'Forbidden' });
    } else {
      next();
    }
  };
}

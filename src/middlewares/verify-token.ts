import { Request, Response, NextFunction } from 'express';

import { TOKEN_HEADER, TOKEN_PAYLOAD_FIELD } from '@src/config';
import { TokenPayload } from '@src/models';
import { TokenService } from '@src/services';

export default function (req: Request, res: Response, next: NextFunction) {
  const token: string = (req.headers[TOKEN_HEADER] || '').toString();

  if (!token) {
    res.status(401);
    res.json({ msg: 'Unauthorized' });
    return;
  }

  TokenService.verifyToken(token)
    .then((payload: TokenPayload) => {
      req[TOKEN_PAYLOAD_FIELD] = payload as TokenPayload;
      next();
    })
    .catch((err) => {
      res.status(401);
      res.json({ msg: 'Invalid Token' });
    });
}

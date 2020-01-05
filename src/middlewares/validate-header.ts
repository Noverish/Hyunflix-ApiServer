import { Request, Response, NextFunction } from 'express';

import { Session } from '@src/models';
import { AUTH_HEADER } from '@src/config';
import { authorityCheck } from '@src/utils';

export default function (req: Request, res: Response, next: NextFunction) {
  const authString: string = (req.headers[AUTH_HEADER] || '').toString();

  if (!authString) {
    res.status(401);
    res.json({ msg: 'Unauthorized' });
  } else {
    req['session'] = JSON.parse(authString);
    next();
  }
}

export function checkUserId(userId: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const session: Session = req['session'];

    if (session.userId !== userId) {
      res.status(403);
      res.json({ msg: 'Forbidden' });
    } else {
      next();
    }
  };
}

export function checkAuthority(authority: number) {
  return function (req: Request, res: Response, next: NextFunction) {
    const session: Session = req['session'];

    if (authorityCheck(session.authority, authority)) {
      res.status(403);
      res.json({ msg: 'Forbidden' });
    } else {
      next();
    }
  };
}

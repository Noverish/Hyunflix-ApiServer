export { Movie } from './Movie';
export { User } from './User';
export { RegCode } from './RegCode';
export { Encode } from './Encode';
export { UserGroup } from './UserGroup';
export { UserGroupAuthority } from './UserGroupAuthority';

import { Request, Response, NextFunction } from 'express';
import { getConnection, createConnection } from 'typeorm';

export function initTypeORM(req: Request, res: Response, next: NextFunction) {
  try {
    getConnection();
    next();
  } catch (err1) {
    createConnection()
      .then((conn) => {
        next();
      })
      .catch((err2) => {
        next(err2);
      })
  }
}
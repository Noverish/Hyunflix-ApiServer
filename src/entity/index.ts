export { Encode } from './Encode';
export { Music } from './Music';
export { Video } from './Video';
export { VideoArticle } from './VideoArticle';

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
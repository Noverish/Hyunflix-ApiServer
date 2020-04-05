import { Response } from 'express';

export const handleServiceResult = (status: number, res: Response) => (result: object) => {
  res.status(status);
  res.json(result);
};

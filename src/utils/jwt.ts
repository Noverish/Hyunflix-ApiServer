import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../credentials';

export function create(obj: object) {
  return jwt.sign(obj, jwtSecret, { expiresIn: '1h' });
}

export function verify(token: string) {
  return jwt.verify(token, jwtSecret);
}

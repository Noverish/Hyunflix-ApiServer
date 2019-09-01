import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../credentials';

export function create(obj: object) {
  return jwt.sign(obj, jwtSecret, { expiresIn: '1h' });
}

export function verify(token: string) {
  console.log(token);
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw '로그인이 만료되었습니다.';
    } else {
      throw '부적절한 토큰입니다';
    }
  }
}

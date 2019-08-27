import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

import { User, RegCode, UserGroupAuthority } from '@src/entity';
import * as jwt from '@src/utils/jwt';
import * as rsa from '@src/utils/rsa';

export function validateToken(req: Request, res: Response, next: NextFunction) {
  if(req.originalUrl.startsWith('/auth')) {
    next();
    return;
  }
  
  if(req.originalUrl.startsWith('/socket.io')) {
    next();
    return;
  }
  
  if (!req.headers.hasOwnProperty('authorization')) {
    res.status(401);
    res.json({ msg: '인증이 필요합니다' });
    return;
  }
  
  const token = req.headers['authorization'].toString().replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token);
    req['user_id'] = decoded.user_id;
    next();
  } catch (err) {
    res.status(401);
    res.json({ msg: '만료되었거나 부적절한 토큰입니다' });
  }
};

export function fetchUserGroupAuthority(req: Request, res: Response, next: NextFunction) {
  const user_id = req['user_id'];
  
  if(!user_id) {
    res.status(500);
    res.json({ msg: 'FetchUserGroupAuthority Error' });
    return;
  }
  
  (async function() {
    const user: User = await User.findByUserId(user_id);
    const authorities: UserGroupAuthority[] = await UserGroupAuthority.findAll(user.group_id);
    req['authorities'] = authorities.map(a => a.path);
    next();
  })().catch(err => {
    next(err);
  })
}

const router: Router = Router();
let nowKeyPair: rsa.RSAKeyPair | null = null;

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const usernameCipher: string = req.body['username'];
  const passwordCipher: string = req.body['password'];
  
  const username = rsa.decrypt(usernameCipher, nowKeyPair.privateKey);
  const password = rsa.decrypt(passwordCipher, nowKeyPair.privateKey);

  (async function () {
    const user: User | null = await User.findByUsername(username);

    if (!user) {
      res.status(400);
      res.json({ msg: '존재하지 않는 아이디입니다' });
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(400);
      res.json({ msg: '비밀번호가 틀렸습니다' });
      return;
    }

    const token = jwt.create({ user_id: user.user_id });

    res.json({ token });
  })().catch((err) => {
    next(err);
  });
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const _regCodeCipher: string = req.body['reg_code'];
  const usernameCipher: string = req.body['username'];
  const passwordCipher: string = req.body['password'];
  
  const username = rsa.decrypt(usernameCipher, nowKeyPair.privateKey);
  const password = rsa.decrypt(passwordCipher, nowKeyPair.privateKey);
  const _regCode = rsa.decrypt(_regCodeCipher, nowKeyPair.privateKey);

  (async function () {
    const regCode: RegCode | null = await RegCode.getRegCode(_regCode);

    if (!regCode) {
      res.status(400);
      res.json({ msg: '존재하지 않는 회원가입 코드입니다' });
      return;
    }

    if (await User.findByUserId(regCode.user_id)) {
      res.status(400);
      res.json({ msg: '이미 사용된 회원가입 코드입니다' });
    }

    if (await User.findByUsername(username)) {
      res.status(400);
      res.json({ msg: '이미 존재하는 아이디입니다' });
      return;
    }

    const hash: string = await bcrypt.hash(password, 10);

    const user: User = await User.insert(regCode.user_id, username, hash);

    const token: string = jwt.create({ user_id: user.user_id });

    res.json({ token });
  })().catch((err) => {
    next(err);
  });
});

router.get('/rsa-key', (req: Request, res: Response, next: NextFunction) => {
  if(!nowKeyPair) {
    nowKeyPair = rsa.generateKey();
  }
  
  res.status(200);
  res.json({ key: nowKeyPair.publicKey });
})

export default router;

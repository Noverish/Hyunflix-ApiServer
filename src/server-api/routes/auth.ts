import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

import { User, RegCode } from 'src/entity';
import { jwt } from 'src/utils';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body['username'];
  const password: string = req.body['password'];

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
  const regCode: string = req.body['reg_code'];
  const username: string = req.body['username'];
  const password: string = req.body['password'];

  (async function () {
    const regCode: RegCode | null = await RegCode.getRegCode(regCode);

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

export default router;

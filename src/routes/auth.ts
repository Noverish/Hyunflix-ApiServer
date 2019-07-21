import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

import * as database from '../database';
import { createError, jwt } from '../utils';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.body['id'];
  const password: string = req.body['password'];

  (async function () {
    const user = await database.getUser(id);

    if (!user) {
      next(createError(400, '존재하지 않는 아이디입니다'));
      return;
    }

    if (!(await bcrypt.compare(password, user['password']))) {
      next(createError(400, '패스워드가 틀렸습니다'));
      return;
    }

    const token = jwt.create({ user_id: user['user_id'] });

    res.json({ token });
  })().catch((err) => {
    next(err);
  });
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const registerCode: string = req.body['register_code'];
  const id: string = req.body['id'];
  const password: string = req.body['password'];

  (async function () {
    if (!(await database.validateRegisterCode(registerCode))) {
      next(createError(401, '존재하지 않는 회원가입 코드입니다'));
      return;
    }
    
    if (await database.alreadyRegistered(registerCode)) {
      next(createError(400, '이미 사용된 회원가입 코드입니다'))
    }

    if (await database.getUser(id)) {
      next(createError(409, '이미 존재하는 아이디입니다'));
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    
    const user = await database.addUser(id, hash, registerCode);

    const token = jwt.create({ user_id: user['user_id'] });

    res.json({ token });
  })().catch((err) => {
    next(err);
  });
});

// router.get('/:path*', function(req: Request, res: Response, next: NextFunction) {
//   process(req, res, next);
// });

// async function process(req: Request, res: Response, next: NextFunction) {
//   const isRaw = req.query.hasOwnProperty('raw');
//   const path = req['decodedPath'];

//   if (isRaw) {
//     processRaw(path, req, res, next);
//   } else {
//     if (fs.existsSync(path)) {
//       processFile(path, req, res, next);
//     } else {
//       next(createError(400, 'Not Exist'));
//     }
//   }
// }

export default router;

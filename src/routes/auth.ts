import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcryptjs';

import * as database from '../database';
import { createError, jwt } from '../utils';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body['username'];
  const password: string = req.body['password'];

  (async function () {
    const user = await database.getUser(username);

    if (!user) {
      next(createError(400, 'Invalid username of password'));
      return;
    }

    if (!bcrypt.compare(password, user['password'])) {
      next(createError(400, 'Invalid username of password'));
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
  const username: string = req.body['username'];
  const password: string = req.body['password'];

  (async function () {
    if (!(await database.validateRegisterCode(registerCode))) {
      next(createError(401, 'Unvalid register code'));
      return;
    }

    if (await database.getUser(username)) {
      next(createError(409, 'Already exist username'));
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    console.log(username, hash, registerCode);
    const user = await database.addUser(username, hash, registerCode);

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

import { Router, Request, Response, NextFunction } from 'express';

const encryptor = require('simple-encryptor')('rlagustjq1q2w3e4r!@#$');

export function encrypt(text: string): string {
  return encryptor.encrypt(text);
}

export function decrypt(cipher: string): string {
  return encryptor.decrypt(cipher);
}

const AccessKeys = {
  42843062019: "근무지원중대 306호",
  960909980727: "Administrator - 김현섭"
}

const router: Router = Router();

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('login');
});

router.post('/', function(req: Request, res: Response, next: NextFunction) {
  setTimeout(() => {
    const accessKey = req.body.accessKey;
    
    if(AccessKeys.hasOwnProperty(accessKey)) {
      const user = AccessKeys[accessKey];
      const encrypted = encrypt(accessKey)
      
        res.render('login-process', { key: encrypted, user: user });
    } else {
      next({ status: 401, msg: '잘못된 접속 키 입니다.'});
    }
  }, 1000);
});

export default router;
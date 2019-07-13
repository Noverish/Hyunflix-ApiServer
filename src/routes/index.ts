import { Router } from 'express';

import AuthRouter from './auth';
import ArchiveRouter from './archive';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/archive/Movies', ArchiveRouter)
router.use('/archive/TV_Series', ArchiveRouter)
router.use('/archive/torrents', ArchiveRouter)
router.use('/archive/Documentaries', ArchiveRouter)

export default router;
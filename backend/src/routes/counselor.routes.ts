import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { updateCounselorProfile } from '../controllers/counselor.controller';

const router = Router();

router.use(protect);

router.put('/profile', updateCounselorProfile);

export default router;
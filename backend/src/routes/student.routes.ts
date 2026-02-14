import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { updateStudentProfile } from '../controllers/student.controller';

const router = Router();

// All student routes are protected
router.use(protect);

router.put('/profile', updateStudentProfile);

export default router;
import { Router } from 'express';
import { getScholarships, getScholarshipById } from '../controllers/scholarship.controller';

const router = Router();

// Public routes
router.get('/', getScholarships);
router.get('/:id', getScholarshipById);

export default router;
import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware';
import {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
} from '../../controllers/admin/scholarship.controller';

const router = Router();

// All routes are protected and require admin role
router.use(protect, authorize('admin'));

router.route('/')
  .post(createScholarship)
  .get(getAllScholarships);

router.route('/:id')
  .get(getScholarshipById)
  .put(updateScholarship)
  .delete(deleteScholarship);

export default router;
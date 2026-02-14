import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import {
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships,
  updateSavedScholarship,
  addMilestone,
  updateMilestone,
} from '../controllers/savedScholarship.controller';

const router = Router();

// All routes are protected and require student role
router.use(protect, authorize('student'));

// Save/unsave a specific scholarship
router.route('/:id/save')
  .post(saveScholarship)
  .delete(unsaveScholarship);

// Get all saved scholarships
router.get('/saved', getSavedScholarships);

// Update a saved scholarship (status, deadline)
router.put('/saved/:savedId', updateSavedScholarship);

// Milestone management
router.post('/saved/:savedId/milestones', addMilestone);
router.put('/saved/:savedId/milestones/:milestoneIdx', updateMilestone);

export default router;
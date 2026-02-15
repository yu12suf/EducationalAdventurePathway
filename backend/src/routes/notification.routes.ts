import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import Notification from '../models/Notification';

const router = Router();

router.use(protect); // all notification routes require auth

// Get my notifications
router.get('/', async (req: any, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ success: true, data: notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Mark a single notification as read
router.put('/:id/read', async (req: any, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.json({ success: true, data: notification });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all as read
router.put('/read-all', async (req: any, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
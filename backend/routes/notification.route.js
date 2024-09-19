import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getUserNotifications);

router.put('/:id/read', protectRoute, markNotificationAsRead);
router.delete('/:id/read', protectRoute, deleteNotificatin);

export default router;

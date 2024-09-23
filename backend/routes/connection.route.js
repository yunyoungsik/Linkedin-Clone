import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { acceptConnectionRequest, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnectionRequest, removeConnection, sendConnectionRequest } from '../controllers/connections.controller.js';

const router = express.Router();

router.post("/request/:userId", protectRoute, sendConnectionRequest);
router.put("/accept/:requestId", protectRoute, acceptConnectionRequest);
router.put("/reject/:requestId", protectRoute, rejectConnectionRequest);
// 현재 사용자에 대한 모든 연결 요청 가져오기
router.get("/requests", protectRoute, getConnectionRequests);
// 사용자의 모든 연결 가져오기
router.get("/", protectRoute, getUserConnections);
router.delete("/:userId", protectRoute, removeConnection);
router.get("/status/:userId", protectRoute, getConnectionStatus);

export default router
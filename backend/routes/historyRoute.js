import express from 'express';
import {
    getAllHistory,
    getHistoryByOrderId,
    getHistoryByTable,
    getHistoryByCustomerPhone,
    getHistoryStats,
    getDailySalesReport,
    deleteOldHistory
} from '../controllers/historyController.js';
import { isVerifiedUser } from '../middlewares/tokenVerification.js';

const router = express.Router();

router.route("/").get(isVerifiedUser, getAllHistory);
router.route("/stats").get(isVerifiedUser, getHistoryStats);
router.route("/daily-sales").get(isVerifiedUser, getDailySalesReport);
router.route("/order/:orderId").get(isVerifiedUser, getHistoryByOrderId);
router.route("/table/:tableId").get(isVerifiedUser, getHistoryByTable);
router.route("/customer/:phone").get(isVerifiedUser, getHistoryByCustomerPhone);
router.route("/cleanup").delete(isVerifiedUser, deleteOldHistory);

export default router;
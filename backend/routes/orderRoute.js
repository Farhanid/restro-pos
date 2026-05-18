import express from 'express'
import { addOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController.js'
import { isVerifiedUser } from '../middlewares/tokenVerification.js'

const router = express.Router()


router.route("/").post(isVerifiedUser, addOrder)
router.route("/").get(isVerifiedUser, getOrders)
router.route("/:id").get(isVerifiedUser, getOrderById)
router.route("/:id").put(isVerifiedUser, updateOrder)
router.route("/:id").delete(isVerifiedUser, deleteOrder)



export default router;





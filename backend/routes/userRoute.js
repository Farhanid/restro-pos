import express from "express";
import { getUserData, login, logout, register } from "../controllers/userController.js";
import { isVerifiedUser } from "../middlewares/tokenVerification.js";


const router = express.Router()

//Authentication Routes
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(isVerifiedUser, logout)
router.route("/").get(isVerifiedUser, getUserData)


export default router;
import createHttpError from 'http-errors'
import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'


export const register = async (req, res, next) => {
    try {
        const { name, email, phone, password, role } = req.body;

        if (!name || !email || !phone || !password || !role) {
            const error = createHttpError(400, "All fields are required!")
            next(error)
        }

        const isUserPresent = await User.findOne({ email })
        if (isUserPresent) {
            const error = createHttpError(400, "User Already Exists!")
            next(error)
        }

        const user = { name, phone, email, password, role }
        const newUser = User(user)
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "New User Created!", data: newUser
        })





    } catch (error) {
        next(error)
    }




}


export const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = createHttpError(400, "All fields are required!")
            return next(error)
        }

        const isUserPresent = await User.findOne({ email })
        if (!isUserPresent) {
            const error = createHttpError(401, "Invalid Credentials");
            return next(error)
        }

        const isMatch = await bcrypt.compare(password, isUserPresent.password)

        if (!isMatch) {
            const error = createHttpError(401, "Invalid Credentials");
            return next(error)
        }

        const accessToken = jwt.sign({ _id: isUserPresent._id }, config.accessTokenSecret, {
            expiresIn: '1d'
        })

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })



        res.status(200).json({
            success: true,
            message: "User login successfully!",
            data: isUserPresent
        })






    } catch (error) {
        next(error)
    }



}




export const getUserData = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        next(error)
    }

}


export const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken')
        res.status(200).json({
            success: true,
            message: "User logout successfully!"
        })

    } catch (error) {
        next(error)
    }
}
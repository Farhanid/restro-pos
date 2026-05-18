import dotenv from 'dotenv'

dotenv.config();

const config = Object.freeze({
    port: process.env.PORT || 3000,
    databaseURL: process.env.MONGO_URL || "mongodb://localhost:27017",
    nodeEnv: process.env.NODE_ENV || "development",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
    razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
})



export default config;
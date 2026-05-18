import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import connectDB from './config/database.js';
import config from './config/config.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'
import tableRoute from './routes/tableRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import historyRoute from './routes/historyRoute.js';


const app = express();
const port = config.port;
connectDB()


app.use(cors({
    credentials: true,
    // origin: ['http://localhost:5173']
    origin: ['https://restro-pos-chi.vercel.app']
}))
app.use(express.json())   // parse incoming request in json format
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }));


// Routes
app.get('/', (req, res) => {
    res.json({ message: "it works" });
});

//Other Endpoints
app.use("/api/user", userRoute)
app.use("/api/order", orderRoute)
app.use("/api/table", tableRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/history", historyRoute);



//Global Error Handler
app.use(globalErrorHandler)



// Start server AFTER DB connects
app.listen(port, () => {
    console.log(`Pos server is listening on port ${port}`)
})
import mongoose from "mongoose";
import config from "./config.js";


const connectDB = async () => {
    try{
        const conn = await mongoose.connect(config.databaseURL)
        console.log('Mongo DB Connected😉🔥')

    }catch(err){
       console.error(err.message)
       process.exit(1)
    }
}

export default connectDB;
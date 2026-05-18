import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNo: { type: Number, required: true, unique: true },
    status: {
        type: String,
        default: "Available"
    },
    seats: {
        type: Number,
        required: true

    },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
})

export default mongoose.model("Table", tableSchema)
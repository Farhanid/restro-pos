import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["In Progress", "pending", "completed", "cancelled", "paid"],
        required: true
    },
    customerDetails: {
        name: String,
        phone: String,
        guests: Number
    },
    items: [{
        id: Number,
        name: String,
        pricePerQuantity: Number,
        quantity: Number,
        price: Number
    }],
    bills: {
        total: Number,
        tax: Number,
        totalWithTax: Number,
        paymentMethod: String
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Index for faster queries
historySchema.index({ createdAt: -1 });
historySchema.index({ table: 1 });
historySchema.index({ orderStatus: 1 });
historySchema.index({ "customerDetails.phone": 1 });

const History = mongoose.model("History", historySchema);
export default History;
import mongoose from "mongoose";
import Order from "../models/orderModel.js"
import createHttpError from 'http-errors'
import { createHistoryFromOrder, updateHistoryFromOrder } from "./historyController.js";

// export const addOrder = async (req, res, next) => {

//     try {     
//         const order = new Order(req.body)
//         console.log("REQ BODY:", req.body);
//         await order.save();
//         res.status(201).json({
//             success: true,
//             message: "Order Created!",   data: order
//         })       
//     } catch (error) {
//         next(error)
//     }
// }
export const addOrder = async (req, res, next) => {
    try {
        const order = new Order(req.body);
        console.log("REQ BODY:", req.body);
        await order.save();

        // Create history record
        await createHistoryFromOrder(order);

        res.status(201).json({
            success: true,
            message: "Order Created!",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {

    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid id!")
            return next(error)
        }

        const order = await Order.findById(id);
        if (!order) {
            const error = createHttpError(404, "Order not found!")
            return next(error)
        }
        res.status(200).json({
            success: true,
            data: order
        })

    } catch (error) {
        next(error)
    }

}


export const getOrders = async (req, res, next) => {

    try {
        const orders = await Order.find().populate("table")
        res.status(200).json({
            data: orders
        })

    } catch (error) {
        next(error)
    }

}

// export const updateOrder = async (req, res, next) => {

//     try {
//         const { orderStatus } = req.body;
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             const error = createHttpError(404, "Invalid id!")
//             return next(error)
//         }

//         const order = await Order.findByIdAndUpdate(
//             id,
//             {orderStatus},
//             {new: true }
//         )

//         if(!order){
//             const error = createHttpError(404, "Order not found!")
//             return next(error)
//         }
//         res.status(200).json({ success: true, message: "Order updated", data: order })

//     } catch (error) {
//         next(error)
//     }

// }

export const updateOrder = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid id!");
            return next(error);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            const error = createHttpError(404, "Order not found!");
            return next(error);
        }

        // Update history record
        await updateHistoryFromOrder(order);

        res.status(200).json({
            success: true,
            message: "Order updated",
            data: order
        });

    } catch (error) {
        next(error);
    }
};


export const deleteOrder = async (req, res, next) => {

    try {
        const { id } = req.params;

        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = createHttpError(404, "Invalid order id!")
            return next(error)
        }

        // Find and delete the order
        const deletedOrder = await Order.findByIdAndDelete(id);

        // Check if order exists
        if (!deletedOrder) {
            const error = createHttpError(404, "Order not found!")
            return next(error)
        }

        res.status(200).json({
            success: true,
            message: "Order deleted successfully!",
            data: deletedOrder
        })

    } catch (error) {
        next(error)
    }
}


































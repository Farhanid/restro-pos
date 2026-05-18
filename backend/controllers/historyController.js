import mongoose from "mongoose";
import History from "../models/historyModel.js";
import Order from "../models/orderModel.js";
import createHttpError from "http-errors";

// Create history record from order (called after order creation/update)
// export const createHistoryFromOrder = async (order) => {
//     try {
//         // Calculate total amount from bills if available, or from items
//         let totalAmount = order.totalAmount;
//         if (!totalAmount && order.bills) {
//             totalAmount = order.bills.totalWithTax || order.bills.total || 0;
//         }
//         if (!totalAmount && order.items) {
//             totalAmount = order.items.reduce((sum, item) => sum + (item.price || 0), 0);
//         }

//         const historyData = {
//             orderId: order._id,
//             table: order.table,
//             orderStatus: order.orderStatus || "pending",
//             customerDetails: order.customerDetails || {},
//             items: order.items || [],
//             bills: order.bills || {},
//             totalAmount: totalAmount,
//             paymentStatus: order.paymentStatus || "pending",
//             createdAt: order.createdAt || new Date(),
//             completedAt: (order.orderStatus === "completed" || order.orderStatus === "cancelled") ? new Date() : undefined
//         };

//         const history = new History(historyData);
//         await history.save();
//         return history;
//     } catch (error) {
//         console.error("Error creating history record:", error);
//         throw error;
//     }
// };
// In createHistoryFromOrder function
export const createHistoryFromOrder = async (order) => {
    try {
        let totalAmount = order.totalAmount;
        if (!totalAmount && order.bills) {
            totalAmount = order.bills.totalWithTax || order.bills.total || 0;
        }
        if (!totalAmount && order.items) {
            totalAmount = order.items.reduce((sum, item) => sum + (item.price || 0), 0);
        }

        const historyData = {
            orderId: order._id,
            table: order.table,
            orderStatus: order.orderStatus || "pending",
            customerDetails: order.customerDetails || {},
            items: order.items || [],
            bills: {
                total: order.bills?.total || 0,
                tax: order.bills?.tax || 0,
                totalWithTax: order.bills?.totalWithTax || 0,
                paymentMethod: order.bills?.paymentMethod || order.paymentMethod || "Cash" // Add this line
            },
            totalAmount: totalAmount,
            paymentStatus: order.paymentStatus || "pending",
            createdAt: order.createdAt || new Date(),
            completedAt: (order.orderStatus === "completed" || order.orderStatus === "cancelled") ? new Date() : undefined
        };

        const history = new History(historyData);
        await history.save();
        return history;
    } catch (error) {
        console.error("Error creating history record:", error);
        throw error;
    }
};





// Update history when order is updated
export const updateHistoryFromOrder = async (order) => {
    try {
        // Calculate total amount from bills if available, or from items
        let totalAmount = order.totalAmount;
        if (!totalAmount && order.bills) {
            totalAmount = order.bills.totalWithTax || order.bills.total || 0;
        }
        if (!totalAmount && order.items) {
            totalAmount = order.items.reduce((sum, item) => sum + (item.price || 0), 0);
        }

        const updateData = {
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus || "pending",
            customerDetails: order.customerDetails || {},
            items: order.items || [],
            bills: order.bills || {},
            totalAmount: totalAmount
        };

        if (order.orderStatus === "completed" || order.orderStatus === "cancelled") {
            updateData.completedAt = new Date();
        }

        const history = await History.findOneAndUpdate(
            { orderId: order._id },
            updateData,
            { new: true, upsert: true }
        );
        return history;
    } catch (error) {
        console.error("Error updating history record:", error);
        throw error;
    }
};

// Get all history records
// export const getAllHistory = async (req, res, next) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             orderStatus,
//             paymentStatus,
//             startDate,
//             endDate,
//             phone
//         } = req.query;

//         const filter = {};

//         if (orderStatus) filter.orderStatus = orderStatus;
//         if (paymentStatus) filter.paymentStatus = paymentStatus;
//         if (phone) filter["customerDetails.phone"] = phone;

//         if (startDate || endDate) {
//             filter.createdAt = {};
//             if (startDate) filter.createdAt.$gte = new Date(startDate);
//             if (endDate) filter.createdAt.$lte = new Date(endDate);
//         }

//         const skip = (parseInt(page) - 1) * parseInt(limit);

//         const [history, total] = await Promise.all([
//             History.find(filter)
//                 .populate("table", "tableNumber capacity")
//                 .populate("orderId", "orderStatus totalAmount")
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(parseInt(limit)),
//             History.countDocuments(filter)
//         ]);

//         res.status(200).json({
//             success: true,
//             data: history,
//             pagination: {
//                 currentPage: parseInt(page),
//                 totalPages: Math.ceil(total / parseInt(limit)),
//                 totalItems: total,
//                 itemsPerPage: parseInt(limit)
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// Get all history records
export const getAllHistory = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            orderStatus,
            paymentStatus,
            startDate,
            endDate,
            phone
        } = req.query;

        const filter = {};

        if (orderStatus) filter.orderStatus = orderStatus;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (phone) filter["customerDetails.phone"] = phone;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [history, total] = await Promise.all([
            History.find(filter)
                .populate("table", "tableNo status seats") // Populate table number
                .populate("orderId", "orderStatus totalAmount")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            History.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};




// Get history by order ID
export const getHistoryByOrderId = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            const error = createHttpError(404, "Invalid order ID!");
            return next(error);
        }

        const history = await History.findOne({ orderId })
            .populate("table", "tableNumber capacity")
            .populate("orderId");

        if (!history) {
            const error = createHttpError(404, "History record not found!");
            return next(error);
        }

        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        next(error);
    }
};

// Get history by table
export const getHistoryByTable = async (req, res, next) => {
    try {
        const { tableId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(tableId)) {
            const error = createHttpError(404, "Invalid table ID!");
            return next(error);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [history, total] = await Promise.all([
            History.find({ table: tableId })
                .populate("table", "tableNumber capacity")
                .populate("orderId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            History.countDocuments({ table: tableId })
        ]);

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get history by customer phone
export const getHistoryByCustomerPhone = async (req, res, next) => {
    try {
        const { phone } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [history, total] = await Promise.all([
            History.find({ "customerDetails.phone": phone })
                .populate("table", "tableNumber capacity")
                .populate("orderId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            History.countDocuments({ "customerDetails.phone": phone })
        ]);

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get history summary/stats
export const getHistoryStats = async (req, res, next) => {
    try {
        const stats = await History.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalTax: { $sum: "$bills.tax" },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ["$orderStatus", "completed"] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] }
                    },
                    inProgressOrders: {
                        $sum: { $cond: [{ $eq: ["$orderStatus", "In Progress"] }, 1, 0] }
                    },
                    paidOrders: {
                        $sum: { $cond: [{ $eq: ["$paymentStatus", "completed"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalOrders: 1,
                    totalRevenue: 1,
                    totalTax: 1,
                    completedOrders: 1,
                    cancelledOrders: 1,
                    inProgressOrders: 1,
                    paidOrders: 1,
                    averageOrderValue: { $divide: ["$totalRevenue", "$totalOrders"] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                totalTax: 0,
                completedOrders: 0,
                cancelledOrders: 0,
                inProgressOrders: 0,
                paidOrders: 0,
                averageOrderValue: 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get daily sales report
export const getDailySalesReport = async (req, res, next) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const report = await History.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    orderStatus: { $in: ["completed", "In Progress"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                    totalTax: { $sum: "$bills.tax" },
                    paymentMethods: {
                        $push: "$bills.paymentMethod"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: startOfDay,
                    totalSales: 1,
                    totalOrders: 1,
                    totalTax: 1,
                    averageOrderValue: { $divide: ["$totalSales", "$totalOrders"] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: report[0] || {
                date: startOfDay,
                totalSales: 0,
                totalOrders: 0,
                totalTax: 0,
                averageOrderValue: 0
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete old history (optional - for cleanup)
export const deleteOldHistory = async (req, res, next) => {
    try {
        const { days = 30 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const result = await History.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} history records older than ${days} days`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        next(error);
    }
};
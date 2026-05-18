import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import BottomNav from "../components/shared/BottomNav";
import BackButton from '../components/shared/BackButton';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const headerVariants = {
        hidden: { y: -30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
            },
        },
    };

    const tableVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.3,
            },
        },
    };

    // Fetch all history data
    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8000/api/history', {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });
            setHistory(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch history');
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // View order details
    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
        document.body.style.overflow = 'hidden';
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        document.body.style.overflow = 'unset';
    };

    // Get table number helper
    const getTableNumber = (table) => {
        if (!table) return 'N/A';
        return table.tableNo || table.tableNumber || 'N/A';
    };

    // Get payment method helper
    const getPaymentMethod = (order) => {
        if (!order) return 'N/A';

        if (order.bills?.paymentMethod) {
            return order.bills.paymentMethod;
        }
        if (order.paymentMethod) {
            return order.paymentMethod;
        }
        if (order.orderId?.paymentMethod) {
            return order.orderId.paymentMethod;
        }
        if (order.razorpayPaymentId) {
            return 'Online';
        }
        return 'Not specified';
    };

    // Get payment method badge color
    const getPaymentMethodColor = (paymentMethod) => {
        switch (paymentMethod?.toLowerCase()) {
            case 'cash':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'online':
            case 'razorpay':
            case 'card':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'upi':
                return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'completed':
                return 'bg-green-500/20 text-green-400 border border-green-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            case 'paid':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading && history.length === 0) {
        return (
            <div className="bg-[#1f1f1f] h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#1f1f1f] h-screen flex justify-center items-center">
                <div className="text-red-400 text-center">
                    <p className="text-lg mb-2">Error loading history</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchHistory}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className='bg-[#1f1f1f] h-screen overflow-y-auto overflow-x-hidden pb-16 lg:pb-0'
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a4a4a #1f1f1f',
                }}
            >
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    {/* Header with BackButton */}
                    <motion.div
                        variants={headerVariants}
                        className="mb-6 sm:mb-8"
                    >
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <BackButton />
                            </div>
                            <div className="flex-1">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-wider"
                                >
                                    Order History
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="text-gray-400 text-xs sm:text-sm mt-1"
                                >
                                    View and manage all your past orders
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Statistics Summary Cards */}
                    {history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 sm:p-4 shadow-lg">
                                <p className="text-white/80 text-xs sm:text-sm">Total Orders</p>
                                <p className="text-white text-xl sm:text-2xl font-bold">{history.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-3 sm:p-4 shadow-lg">
                                <p className="text-white/80 text-xs sm:text-sm">Total Revenue</p>
                                <p className="text-white text-xl sm:text-2xl font-bold">
                                    {formatCurrency(history.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-3 sm:p-4 shadow-lg">
                                <p className="text-white/80 text-xs sm:text-sm">Avg Order Value</p>
                                <p className="text-white text-xl sm:text-2xl font-bold">
                                    {formatCurrency(history.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / (history.length || 1))}
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-3 sm:p-4 shadow-lg">
                                <p className="text-white/80 text-xs sm:text-sm">In Progress</p>
                                <p className="text-white text-xl sm:text-2xl font-bold">
                                    {history.filter(order => order.orderStatus === 'In Progress').length}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* History Table */}
                    <motion.div variants={tableVariants} className="bg-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-[#1f1f1f] sticky top-0">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Table</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-16 h-16 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <p className="text-gray-400 text-lg">No history records found</p>
                                                    <p className="text-gray-500 text-sm mt-1">Orders you create will appear here</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((record, index) => (
                                            <motion.tr
                                                key={record._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-[#353535] transition-all duration-300 group"
                                            >
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                    #{record.orderId?._id?.slice(-6) || record.orderId?.slice(-6) || record._id?.slice(-6)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-white">
                                                        {record.customerDetails?.name || 'Guest'}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {record.customerDetails?.phone || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-700 text-gray-300 text-xs font-medium">
                                                        Table {getTableNumber(record.table)}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.orderStatus)}`}>
                                                        {record.orderStatus}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-bold">
                                                    {formatCurrency(record.totalAmount)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    {formatDate(record.createdAt)}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => viewOrderDetails(record)}
                                                        className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-gray-900 font-medium rounded-lg transition-all duration-300 hover:scale-105"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Navigation - Mobile Only */}
                {/* <BottomNav /> */}
            </motion.div>

            {/* Order Details Modal - Fixed with Proper Scrolling */}
            <AnimatePresence>
                {showModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                        onClick={closeModal}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" onClick={closeModal} />

                        {/* Modal Container */}
                        <div className="absolute inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                    transition={{ type: "spring", damping: 20 }}
                                    className="relative bg-[#2a2a2a] rounded-2xl w-full max-w-3xl my-8 border border-gray-700 shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Sticky Header - stays at top */}
                                    <div className="sticky top-0 bg-gradient-to-r from-[#2a2a2a] to-[#323232] rounded-t-2xl border-b border-gray-700 px-6 py-4 z-10">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Order Details</h3>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Order #{selectedOrder.orderId?._id?.slice(-6) || selectedOrder.orderId?.slice(-6) || selectedOrder._id?.slice(-6)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={closeModal}
                                                className="text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 transform"
                                            >
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content - This is what scrolls */}
                                    <div className="px-6 py-6 space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">
                                        {/* Customer Info */}
                                        <div className="bg-gradient-to-r from-[#1f1f1f] to-[#252525] p-4 rounded-xl border border-gray-700">
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Customer Information
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-gray-400 text-xs">Name</p>
                                                    <p className="text-white font-medium">{selectedOrder.customerDetails?.name || 'Guest'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Phone</p>
                                                    <p className="text-white font-medium">{selectedOrder.customerDetails?.phone || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Guests</p>
                                                    <p className="text-white font-medium">{selectedOrder.customerDetails?.guests || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Table</p>
                                                    <p className="text-white font-medium">Table {getTableNumber(selectedOrder.table)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                                Order Items ({selectedOrder.items?.length || 0})
                                            </h4>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-700">
                                                    <thead className="bg-[#1f1f1f]">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Item</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Qty</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Price</th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-700">
                                                        {selectedOrder.items?.map((item, index) => (
                                                            <tr key={index} className="hover:bg-[#252525] transition-colors">
                                                                <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-300">{item.quantity}</td>
                                                                <td className="px-4 py-3 text-sm text-gray-300">{formatCurrency(item.pricePerQuantity)}</td>
                                                                <td className="px-4 py-3 text-sm text-yellow-400 font-medium">{formatCurrency(item.price)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Bill Details */}
                                        {selectedOrder.bills && (
                                            <div className="bg-gradient-to-r from-[#1f1f1f] to-[#252525] p-4 rounded-xl border border-gray-700">
                                                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Bill Details
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-gray-300">
                                                        <span>Subtotal:</span>
                                                        <span>{formatCurrency(selectedOrder.bills.total)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-300">
                                                        <span>Tax:</span>
                                                        <span>{formatCurrency(selectedOrder.bills.tax)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                                                        <span>Total:</span>
                                                        <span className="text-yellow-400">{formatCurrency(selectedOrder.bills.totalWithTax)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2">
                                                        <span className="text-gray-300">Payment Method:</span>
                                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentMethodColor(getPaymentMethod(selectedOrder))}`}>
                                                            {getPaymentMethod(selectedOrder)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Status */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Order Status
                                            </h4>
                                            <div className="flex gap-3 flex-wrap">
                                                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}>
                                                    {selectedOrder.orderStatus}
                                                </span>
                                                <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${selectedOrder.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                                                    Payment: {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default History;
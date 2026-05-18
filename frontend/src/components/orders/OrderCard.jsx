import { FaCheckDouble, FaCircle, FaTrash } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import { HiArrowLongRight } from "react-icons/hi2";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const OrderCard = ({ order, onDelete, onUpdateStatus }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setShowConfirmModal(false);
        try {
            await onDelete(order._id);
            enqueueSnackbar(`Order for ${order.customerDetails.name} deleted successfully!`, { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to delete order!", { variant: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
    };

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            await onUpdateStatus(order._id, { orderStatus: newStatus });
            setSelectedStatus(newStatus);
            enqueueSnackbar(`Order status updated to ${newStatus}!`, { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to update order status!", { variant: "error" });
        } finally {
            setIsUpdating(false);
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'in progress':
                return 'text-blue-600 bg-blue-500/20';
            case 'ready':
                return 'text-green-600 bg-green-500/20';
            case 'completed':
                return 'text-purple-600 bg-purple-500/20';
            default:
                return 'text-green-600 bg-[#2e4a40]';
        }
    };

    return (
        <>
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-110 bg-[#262626] p-4 sm:p-6 rounded-lg mb-4 relative mx-auto">
                {/* Delete Button - Top Right Corner */}
                <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    title="Delete Order"
                >
                    {isDeleting ? (
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FaTrash className="text-xs sm:text-sm" />
                    )}
                </button>

                {/* Top Section - Responsive */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-3 sm:mb-4 pr-6 sm:pr-8">
                    {/* Avatar - Mobile centered */}
                    <div className="flex justify-center w-full sm:w-auto">
                        <button className="bg-[#f6b100] p-2 sm:p-3 text-lg sm:text-xl font-bold rounded-lg min-w-[45px] sm:min-w-[60px]">
                            {getAvatarName(order.customerDetails.name)}
                        </button>
                    </div>

                    {/* Content - Responsive */}
                    <div className="flex flex-col sm:flex-row justify-between w-full gap-3 sm:gap-4">
                        {/* Left Section */}
                        <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                            <h1 className="text-[#f5f5f5] text-base sm:text-lg font-semibold tracking-wide">
                                {order.customerDetails.name}
                            </h1>
                            <p className="text-[#ababab] text-xs sm:text-sm">
                                #{Math.floor(new Date(order.orderDate).getTime()).toString().slice(-8)} Dine In
                            </p>

                            <p className="flex items-center justify-center sm:justify-start gap-2 text-[#ababab] text-xs sm:text-sm">
                                <span className="text-base sm:text-lg font-bold text-white">Table</span>
                                <HiArrowLongRight className="text-sm sm:text-lg text-white" />
                                <span>{order.table?.tableNo}</span>
                            </p>
                        </div>

                        {/* Right Section - Status Dropdown */}
                        <div className="flex flex-col items-center sm:items-end gap-2">
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={isUpdating}
                                className={`${getStatusColor(selectedStatus)} px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer border-none outline-none disabled:opacity-50 w-full sm:w-auto`}
                                style={{
                                    backgroundColor: selectedStatus?.toLowerCase() === 'in progress' ? '#3b82f620' :
                                        selectedStatus?.toLowerCase() === 'ready' ? '#22c55e20' :
                                            selectedStatus?.toLowerCase() === 'completed' ? '#a855f720' : '#2e4a40'
                                }}
                            >
                                <option value="In Progress" className="text-blue-600 bg-[#1f1f1f]">
                                    🔄 In Progress
                                </option>
                                <option value="Ready" className="text-green-600 bg-[#1f1f1f]">
                                    ✅ Ready
                                </option>
                                <option value="Completed" className="text-purple-600 bg-[#1f1f1f]">
                                    ✔️ Completed
                                </option>
                            </select>

                            {isUpdating && (
                                <div className="text-xs text-[#ababab] animate-pulse">
                                    Updating...
                                </div>
                            )}

                            <p className="text-[#ababab] text-xs sm:text-sm hidden sm:block">
                                <FaCircle className="inline mr-2 text-green-600 text-xs" />
                                Ready to serve
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile Status Badge */}
                <div className="sm:hidden flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                    <p className="text-[#ababab] text-xs">
                        <FaCircle className="inline mr-2 text-green-600 text-xs" />
                        Ready to serve
                    </p>
                </div>

                {/* Bottom Section - Responsive Grid */}
                <div className="grid grid-cols-2 sm:flex sm:justify-between items-center gap-3 sm:gap-4 mt-4 text-[#ababab] text-xs sm:text-sm">
                    <div>
                        <p className="text-[#8a8a8a] text-xs">Date & Time</p>
                        <p className="text-[#f5f5f5] text-xs sm:text-sm">{formatDateAndTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right sm:text-left">
                        <p className="text-[#8a8a8a] text-xs">Items</p>
                        <p className="text-[#f5f5f5] text-xs sm:text-sm">{order.items?.length || 0} Items</p>
                    </div>
                </div>

                <hr className="mt-3 sm:mt-4 w-full border-t border-gray-700" />

                {/* Total Section */}
                <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <h1 className="text-[#f5f5f5] text-lg sm:text-xl font-semibold">Total</h1>
                    <p className="text-[#f5f5f5] text-base sm:text-lg font-semibold">
                        ${order.bills.totalWithTax.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Custom Confirmation Modal - Responsive */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#262626] rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 border border-gray-700">
                        <h2 className="text-[#f5f5f5] text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Delete</h2>

                        <p className="text-[#ababab] text-sm sm:text-base mb-3 sm:mb-4">
                            Are you sure you want to delete the order for{' '}
                            <span className="text-[#f6b100] font-semibold">
                                {order.customerDetails.name}
                            </span>?
                        </p>

                        <div className="bg-[#1f1f1f] p-2 sm:p-3 rounded-lg mb-3 sm:mb-4">
                            <p className="text-[#ababab] text-xs sm:text-sm mb-2 font-semibold">
                                Order Details:
                            </p>
                            <p className="text-[#f5f5f5] text-xs sm:text-sm">
                                🪑 Table: #{order.table?.tableNo}
                            </p>
                            <p className="text-[#f5f5f5] text-xs sm:text-sm">
                                📦 Items: {order.items?.length || 0}
                            </p>
                            <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-2">
                                💰 Total: ${order.bills.totalWithTax.toFixed(2)}
                            </p>
                        </div>

                        <p className="text-red-500 text-xs sm:text-sm mb-4 sm:mb-6">
                            ⚠️ This action cannot be undone!
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                className="flex-1 bg-[#383838] text-[#f5f5f5] py-2 rounded-lg hover:bg-[#4a4a4a] transition-all text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 text-sm sm:text-base"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderCard;











// import { FaTrash, FaShoppingBag, FaCheckCircle, FaSpinner, FaHourglassHalf, FaRegClock, FaUserFriends, FaPhone } from "react-icons/fa";
// import { MdOutlineTableRestaurant, MdOutlineReceiptLong, MdPayment } from "react-icons/md";
// import { HiOutlineDotsVertical } from "react-icons/hi";
// import { formatDateAndTime, getAvatarName } from "../../utils/index";
// import { enqueueSnackbar } from "notistack";
// import { useState } from "react";

// const OrderCard = ({ order, onDelete, onUpdateStatus }) => {
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [showConfirmModal, setShowConfirmModal] = useState(false);
//     const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
//     const [isUpdating, setIsUpdating] = useState(false);
//     const [showMenu, setShowMenu] = useState(false);

//     const handleDeleteClick = () => {
//         setShowConfirmModal(true);
//         setShowMenu(false);
//     };

//     const handleConfirmDelete = async () => {
//         setIsDeleting(true);
//         setShowConfirmModal(false);
//         try {
//             await onDelete(order._id);
//             enqueueSnackbar(`Order for ${order.customerDetails.name} deleted successfully!`, { variant: "success" });
//         } catch (error) {
//             enqueueSnackbar("Failed to delete order!", { variant: "error" });
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     const handleCancelDelete = () => {
//         setShowConfirmModal(false);
//     };

//     const handleStatusChange = async (newStatus) => {
//         setIsUpdating(true);
//         try {
//             await onUpdateStatus(order._id, { orderStatus: newStatus });
//             setSelectedStatus(newStatus);
//             enqueueSnackbar(`Order status updated to ${newStatus}!`, { variant: "success" });
//         } finally {
//             setIsUpdating(false);
//         }
//     };

//     const getStatusConfig = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'in progress':
//                 return {
//                     bg: '#f59e0b',
//                     icon: <FaHourglassHalf className="text-yellow-600" />,
//                     label: 'IN PROGRESS',
//                     textColor: 'text-yellow-700'
//                 };
//             case 'ready':
//                 return {
//                     bg: '#10b981',
//                     icon: <FaSpinner className="text-green-600 animate-spin" />,
//                     label: 'READY',
//                     textColor: 'text-green-700'
//                 };
//             case 'completed':
//                 return {
//                     bg: '#8b5cf6',
//                     icon: <FaCheckCircle className="text-purple-600" />,
//                     label: 'COMPLETED',
//                     textColor: 'text-purple-700'
//                 };
//             default:
//                 return {
//                     bg: '#6b7280',
//                     icon: <FaRegClock className="text-gray-600" />,
//                     label: 'PENDING',
//                     textColor: 'text-gray-700'
//                 };
//         }
//     };

//     const statusConfig = getStatusConfig(selectedStatus);
//     const orderNumber = Math.floor(new Date(order.orderDate).getTime()).toString().slice(-6);

//     return (
//         <>
//             <div className="relative group">
//                 {/* Main Card - Compact Design */}
//                 <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">

//                     {/* Compact Top Bar */}
//                     <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
//                         <div className="flex items-center gap-2">
//                             <div
//                                 className="w-2 h-2 rounded-full"
//                                 style={{ backgroundColor: statusConfig.bg }}
//                             />
//                             <div className="flex items-center gap-1.5">
//                                 {statusConfig.icon}
//                                 <span className={`text-xs font-semibold tracking-wide ${statusConfig.textColor}`}>
//                                     {statusConfig.label}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-400">#{orderNumber}</span>
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setShowMenu(!showMenu)}
//                                     className="p-1 rounded-lg hover:bg-gray-100 transition-all"
//                                 >
//                                     <HiOutlineDotsVertical className="text-gray-400 text-base" />
//                                 </button>
//                                 {showMenu && (
//                                     <>
//                                         <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
//                                         <div className="absolute right-0 top-6 z-20 w-36 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
//                                             <button
//                                                 onClick={handleDeleteClick}
//                                                 className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-all flex items-center gap-2"
//                                             >
//                                                 <FaTrash className="text-xs" />
//                                                 Delete Order
//                                             </button>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Customer Section - Compact */}
//                     <div className="px-4 py-3 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             {/* Avatar - Smaller */}
//                             <div className="flex-shrink-0">
//                                 <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
//                                     <span className="text-white font-bold text-base">
//                                         {getAvatarName(order.customerDetails.name)}
//                                     </span>
//                                 </div>
//                             </div>

//                             {/* Customer Info */}
//                             <div className="flex-1">
//                                 <h3 className="text-base font-bold text-gray-900">
//                                     {order.customerDetails.name}
//                                 </h3>
//                                 <div className="flex items-center gap-3 mt-1 flex-wrap">
//                                     <div className="flex items-center gap-1">
//                                         <MdOutlineTableRestaurant className="text-gray-400 text-xs" />
//                                         <span className="text-gray-600 text-xs">Table {order.table?.tableNo}</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <FaUserFriends className="text-gray-400 text-xs" />
//                                         <span className="text-gray-600 text-xs">{order.customerDetails.guests} Guests</span>
//                                     </div>
//                                     {order.customerDetails.phone && (
//                                         <div className="flex items-center gap-1">
//                                             <FaPhone className="text-gray-400 text-xs" />
//                                             <span className="text-gray-500 text-xs">{order.customerDetails.phone}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Items & Bill Summary - Combined Compact Row */}
//                     <div className="px-4 py-2.5 bg-gray-50 flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             <div className="flex items-center gap-1.5">
//                                 <FaShoppingBag className="text-gray-400 text-sm" />
//                                 <span className="text-gray-600 text-xs">Items:</span>
//                                 <span className="text-gray-900 font-semibold text-sm">{order.items?.length || 0}</span>
//                             </div>
//                             <div className="h-4 w-px bg-gray-200" />
//                             <div className="flex items-center gap-1.5">
//                                 <MdPayment className="text-gray-400 text-sm" />
//                                 <span className="text-gray-600 text-xs">Tax:</span>
//                                 <span className="text-gray-700 text-sm">₹{order.bills.tax.toFixed(2)}</span>
//                             </div>
//                         </div>
//                         <div className="text-right">
//                             <span className="text-gray-500 text-xs">Total</span>
//                             <p className="text-amber-600 font-bold text-base">₹{order.bills.totalWithTax.toFixed(2)}</p>
//                         </div>
//                     </div>

//                     {/* Footer - Date & Payment */}
//                     <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs">
//                         <div className="flex items-center gap-1.5">
//                             <FaRegClock className="text-gray-400 text-xs" />
//                             <span className="text-gray-500">{formatDateAndTime(order.createdAt)}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                             <MdOutlineReceiptLong className="text-gray-400 text-xs" />
//                             <span className="text-gray-500">Payment: {order.bills.paymentMethod || 'Pending'}</span>
//                         </div>
//                     </div>

//                     {/* Status Update - Compact Dropdown */}
//                     <div className="px-4 py-2.5 bg-white">
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={selectedStatus}
//                                 onChange={(e) => handleStatusChange(e.target.value)}
//                                 disabled={isUpdating}
//                                 className="flex-1 px-2.5 py-1.5 bg-gray-50 border rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all disabled:opacity-50"
//                                 style={{ borderColor: statusConfig.bg }}
//                             >
//                                 <option value="In Progress">🔄 In Progress</option>
//                                 <option value="Ready">✅ Ready to Serve</option>
//                                 <option value="Completed">✔️ Completed</option>
//                             </select>
//                             {isUpdating && (
//                                 <div className="flex items-center gap-1">
//                                     <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
//                                     <span className="text-xs text-gray-400">Updating...</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Compact Confirmation Modal */}
//                 {showConfirmModal && (
//                     <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
//                         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancelDelete} />
//                         <div className="relative bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
//                             {/* Modal Header */}
//                             <div className="bg-red-50 px-5 py-3 border-b border-red-100">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
//                                         <FaTrash className="text-red-600 text-sm" />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-base font-bold text-gray-900">Delete Order</h2>
//                                         <p className="text-gray-500 text-xs">This action cannot be undone</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Modal Body */}
//                             <div className="p-4">
//                                 <p className="text-gray-700 text-sm mb-3">
//                                     Delete order for{' '}
//                                     <span className="font-bold text-amber-600">
//                                         {order.customerDetails.name}
//                                     </span>?
//                                 </p>

//                                 {/* Order Summary */}
//                                 <div className="bg-gray-50 rounded-lg p-3 mb-3">
//                                     <div className="space-y-1.5 text-sm">
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-500">Order ID</span>
//                                             <span className="text-gray-700 font-mono">#{orderNumber}</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-500">Table</span>
//                                             <span className="text-gray-700">Table {order.table?.tableNo}</span>
//                                         </div>
//                                         <div className="flex justify-between pt-1 border-t border-gray-200">
//                                             <span className="text-gray-700 font-semibold">Total</span>
//                                             <span className="text-amber-600 font-bold">₹{order.bills.totalWithTax.toFixed(2)}</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Warning */}
//                                 <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
//                                     <p className="text-red-700 text-xs flex items-center gap-1.5">
//                                         <span className="text-sm">⚠️</span>
//                                         This will permanently delete the order
//                                     </p>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={handleCancelDelete}
//                                         className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleConfirmDelete}
//                                         disabled={isDeleting}
//                                         className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm disabled:opacity-50"
//                                     >
//                                         {isDeleting ? (
//                                             <div className="flex items-center justify-center gap-1.5">
//                                                 <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                                 Deleting...
//                                             </div>
//                                         ) : (
//                                             'Delete'
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// };

// export default OrderCard;
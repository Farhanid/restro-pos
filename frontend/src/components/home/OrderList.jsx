import { FaCheckDouble, FaTrash } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { getAvatarName } from "../../utils";
import { useState } from "react";

const OrderList = ({ order, onDelete, showDelete = false }) => {  // ✅ Add showDelete prop (default false)
   const [isDeleting, setIsDeleting] = useState(false);
   const [showConfirm, setShowConfirm] = useState(false);

   const handleDeleteClick = () => {
      setShowConfirm(true);
   };

   const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
         await onDelete(order._id);
         setShowConfirm(false);
      } catch (error) {
         console.error("Delete failed:", error);
      } finally {
         setIsDeleting(false);
      }
   };

   const handleCancelDelete = () => {
      setShowConfirm(false);
   };

   // console.log(order);

   return (
      <>
         <div className="group relative flex items-start sm:items-center gap-2 sm:gap-3 md:gap-5 mb-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#1f1f24] to-[#1a1a1f] hover:from-[#22222a] hover:to-[#1e1e24] transition-all duration-300 border border-[#2a2a2a]/50 hover:border-[#025cca]/30 shadow-lg hover:shadow-xl">

            {/* Delete Button - Only show if showDelete is true */}
            {showDelete && (
               <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="absolute -right-2 -top-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2.5 rounded-full transition-all duration-300 z-10 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-110 active:scale-95"
                  title="Delete Order"
               >
                  {isDeleting ? (
                     <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                     <FaTrash className="text-xs" />
                  )}
               </button>
            )}

            {/* Avatar Button */}
            <button className="relative bg-gradient-to-br from-[#f6b100] to-[#f59e0b] p-2 sm:p-3 text-base sm:text-xl font-bold rounded-xl min-w-[50px] sm:min-w-[60px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group">
               <span className="relative z-10 text-[#1a1a1a]">
                  {getAvatarName(order.customerDetails.name)}
               </span>
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
               {/* Customer Info */}
               <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                  <h1 className="text-[#f5f5f5] text-base sm:text-lg font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                     {order.customerDetails.name}
                  </h1>
                  <div className="flex items-center gap-2">
                     <p className="text-[#ababab] text-xs sm:text-sm">
                        {order?.items?.length || order?.item?.length || 2} Items
                     </p>
                     <span className="w-1 h-1 bg-[#2a2a2a] rounded-full"></span>
                     <p className="text-[#ababab] text-xs sm:text-sm">
                        Order #{order._id?.slice(-6) || "N/A"}
                     </p>
                  </div>
               </div>

               {/* Table Badge */}
               <div className="w-full sm:w-auto">
                  <div className="inline-flex items-center gap-2 bg-[#f6b100]/10 border border-[#f6b100]/30 rounded-lg p-1.5 sm:p-2 backdrop-blur-sm">
                     <div className="w-2 h-2 bg-[#f6b100] rounded-full animate-pulse"></div>
                     <h1 className="text-[#f6b100] font-bold text-xs sm:text-sm">
                        Table {typeof order.table === 'object' ? order.table?.tableNo : order.table}
                     </h1>
                  </div>
               </div>

               {/* Status Section */}
               <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="group/status">
                     <p className="text-green-500 text-sm sm:text-base font-semibold flex items-center gap-1">
                        <span className="relative flex h-2 w-2 mr-1 sm:mr-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <FaCheckDouble className="inline mr-1 sm:mr-2 text-sm sm:text-base text-green-500" />
                        Ready
                     </p>
                  </div>
                  <p className="text-[#ababab] text-xs sm:text-sm flex items-center gap-1">
                     <FaCircle className="text-green-500 text-xs sm:text-sm" />
                     Ready to serve
                  </p>
               </div>
            </div>
         </div>

         {/* Confirmation Modal - Enhanced UI */}
         {showDelete && showConfirm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
               <div className="bg-gradient-to-br from-[#26262e] to-[#1e1e24] rounded-2xl p-6 max-w-md w-full mx-4 border border-[#2a2a2a]/70 shadow-2xl transform transition-all duration-300 animate-slideUp">
                  {/* Modal Header */}
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                        <FiAlertTriangle className="text-red-500 text-2xl" />
                     </div>
                     <h2 className="text-[#f5f5f5] text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Confirm Delete
                     </h2>
                  </div>

                  <p className="text-[#ababab] mb-4 leading-relaxed">
                     Are you sure you want to delete the order for{' '}
                     <span className="text-[#f6b100] font-bold">
                        {order.customerDetails.name}
                     </span>?
                  </p>

                  {/* Order Details Card */}
                  <div className="bg-[#1a1a1f] rounded-xl p-4 mb-4 border border-[#2a2a2a]/50">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[#ababab] text-sm">Table Number:</span>
                        <span className="text-[#f6b100] font-bold">
                           #{typeof order.table === 'object' ? order.table?.tableNo : order.table}
                        </span>
                     </div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[#ababab] text-sm">Total Items:</span>
                        <span className="text-[#f5f5f5] font-bold">
                           {order?.items?.length || order?.item?.length || 2}
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[#ababab] text-sm">Order ID:</span>
                        <span className="text-[#ababab] text-xs font-mono">
                           {order._id?.slice(-8) || "N/A"}
                        </span>
                     </div>
                  </div>

                  {/* Warning Message */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
                     <p className="text-red-400 text-sm text-center font-semibold flex items-center justify-center gap-2">
                        <FiAlertTriangle className="text-red-400" />
                        This action cannot be undone!
                     </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                     <button
                        onClick={handleCancelDelete}
                        className="flex-1 bg-gradient-to-r from-[#383838] to-[#2a2a2a] text-[#f5f5f5] py-2.5 rounded-xl hover:from-[#4a4a4a] hover:to-[#383838] transition-all duration-300 font-semibold shadow-lg"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                     >
                        {isDeleting ? (
                           <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Deleting...
                           </span>
                        ) : (
                           "Delete Order"
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Add animation styles to your global CSS */}
         <style jsx>{`
            @keyframes fadeIn {
               from { opacity: 0; }
               to { opacity: 1; }
            }
            @keyframes slideUp {
               from { opacity: 0; transform: translateY(20px); }
               to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
               animation: fadeIn 0.2s ease-out;
            }
            .animate-slideUp {
               animation: slideUp 0.3s ease-out;
            }
         `}</style>
      </>
   );
};

export default OrderList;
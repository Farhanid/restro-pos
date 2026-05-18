import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrder } from "../../https";
import { formatDateAndTime } from "../../utils";
import { useState } from "react";

const RecentOrder = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            return await getOrders();
        },
        placeholderData: keepPreviousData
    });

    // Update order status mutation
    const updateOrderMutation = useMutation({
        mutationFn: ({ id, data }) => updateOrder(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["orders"]);
            enqueueSnackbar("Order status updated successfully!", { variant: "success" });
        },
        onError: (error) => {
            enqueueSnackbar(
                error.response?.data?.message || "Failed to update order status!",
                { variant: "error" }
            );
        },
    });


    const handleStatusChange = async (orderId, newStatus) => {
        await updateOrderMutation.mutateAsync({ id: orderId, data: { orderStatus: newStatus } });
    };

    // ✅ Enhanced search - search by customer name, order ID, table number, or phone
    const filteredOrders = resData?.data?.data?.filter(order => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();

        return order.customerDetails?.name?.toLowerCase().includes(searchLower) ||
            order._id?.toLowerCase().includes(searchLower) ||
            order.table?.tableNo?.toString().includes(searchLower) ||
            order.customerDetails?.phone?.includes(searchTerm);
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    return (
        <div className="px-4 sm:px-0">
            <div className="container mx-auto bg-[#262626] p-3 sm:p-4 rounded-lg">

                {/* Header with Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h2 className="text-[#f5f5f5] text-lg sm:text-xl font-semibold">
                        Recent Orders
                    </h2>

                    {/* Search Input */}
                    <div className="flex items-center gap-2 bg-[#1f1f1f] rounded-lg px-3 py-2 w-full sm:w-80">
                        <svg className="w-4 h-4 text-[#ababab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, order ID, table or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-[#f5f5f5] w-full text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="text-[#ababab] hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Show search results count */}
                {searchTerm && filteredOrders && (
                    <div className="text-[#ababab] text-xs mb-3">
                        Found {filteredOrders.length} result(s) for "{searchTerm}"
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block w-8 h-8 border-4 border-[#f6b100] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[#ababab] mt-2">Loading orders...</p>
                    </div>
                ) : filteredOrders?.length > 0 ? (
                    <>
                        {/* Mobile View - Card Layout */}
                        <div className="block lg:hidden space-y-3">
                            {filteredOrders.map((order) => (
                                <div key={order._id} className="bg-[#1f1f1f] rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="text-[#f5f5f5] text-sm font-semibold">
                                                #{order._id.slice(-6)}
                                            </p>
                                            <p className="text-[#ababab] text-xs">
                                                {order.customerDetails?.name}
                                            </p>
                                            {order.customerDetails?.phone && (
                                                <p className="text-[#ababab] text-xs mt-1">
                                                    📞 {order.customerDetails.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-[#ababab] text-xs">Status</p>
                                            <select
                                                className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-1.5 rounded-lg focus:outline-none text-xs w-full mt-1 ${order.orderStatus === "Ready" ? "text-green-500" :
                                                    order.orderStatus === "Completed" ? "text-purple-500" : "text-yellow-500"
                                                    }`}
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                <option className="text-yellow-500" value="In Progress">
                                                    🔄 In Progress
                                                </option>
                                                <option className="text-green-500" value="Ready">
                                                    ✅ Ready
                                                </option>
                                                <option className="text-purple-500" value="Completed">
                                                    ✔️ Completed
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <p className="text-[#ababab] text-xs">Date & Time</p>
                                            <p className="text-[#f5f5f5] text-xs mt-1">
                                                {formatDateAndTime(order.createdAt)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[#ababab] text-xs">Items</p>
                                            <p className="text-[#f5f5f5] text-xs mt-1">
                                                {order.items?.length || 0} Items
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[#ababab] text-xs">Table No</p>
                                            <p className="text-[#f5f5f5] text-xs mt-1">
                                                Table - {order.table?.tableNo || 'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[#ababab] text-xs">Total</p>
                                            <p className="text-[#f5f5f5] text-sm font-semibold mt-1">
                                                ₹{order.bills?.totalWithTax?.toFixed(2) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table Layout */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left text-[#f5f5f5] min-w-[800px]">
                                <thead className="bg-[#333] text-[#ababab]">
                                    <tr>
                                        <th className="p-3 text-sm">Order ID</th>
                                        <th className="p-3 text-sm">Customer</th>
                                        <th className="p-3 text-sm">Status</th>
                                        <th className="p-3 text-sm">Date & Time</th>
                                        <th className="p-3 text-sm">Items</th>
                                        <th className="p-3 text-sm">Table No</th>
                                        <th className="p-3 text-sm">Total</th>
                                        <th className="p-3 text-sm text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-600 hover:bg-[#333]">
                                            <td className="p-3 text-sm">#{order._id.slice(-6)}</td>
                                            <td className="p-3 text-sm">
                                                {order.customerDetails?.name}
                                                {order.customerDetails?.phone && (
                                                    <p className="text-[#ababab] text-xs">{order.customerDetails.phone}</p>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <select
                                                    className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none text-sm ${order.orderStatus === "Ready" ? "text-green-500" :
                                                        order.orderStatus === "Completed" ? "text-purple-500" : "text-yellow-500"
                                                        }`}
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                >
                                                    <option className="text-yellow-500" value="In Progress">
                                                        🔄 In Progress
                                                    </option>
                                                    <option className="text-green-500" value="Ready">
                                                        ✅ Ready
                                                    </option>
                                                    <option className="text-purple-500" value="Completed">
                                                        ✔️ Completed
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="p-3 text-sm">{formatDateAndTime(order.createdAt)}</td>
                                            <td className="p-3 text-sm">{order.items?.length || 0} Items</td>
                                            <td className="p-3 text-sm">Table - {order.table?.tableNo || 'N/A'}</td>
                                            <td className="p-3 text-sm">₹{order.bills?.totalWithTax?.toFixed(2) || 0}</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleStatusChange(order._id,
                                                        order.orderStatus === "In Progress" ? "Ready" :
                                                            order.orderStatus === "Ready" ? "Completed" : "Completed"
                                                    )}
                                                    className="text-blue-400 hover:text-blue-500 transition"
                                                    title="Update Status"
                                                >
                                                    <GrUpdate size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-[#ababab] text-lg">No orders found</p>
                        <p className="text-[#ababab] text-sm mt-1">
                            {searchTerm ? `No results matching "${searchTerm}"` : "Orders will appear here once created"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentOrder;
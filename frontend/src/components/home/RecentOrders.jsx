import { FaSearch } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https";
import { useNavigate } from "react-router-dom";

const RecentOrders = () => {

    const navigate = useNavigate()

    const { data: resData, isError } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            return await getOrders();
        },
        placeholderData: keepPreviousData
    })

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" })
    }

    return (
        <div className="px-4 sm:px-6 md:px-8 mt-4 sm:mt-6">

            <div className="bg-gradient-to-br from-[#1e1e24] to-[#16161a] w-full h-[400px] sm:h-[420px] md:h-[400px] rounded-2xl shadow-2xl border border-[#2a2a2a]/50 backdrop-blur-sm flex flex-col">

                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-[#2a2a2a]/70 bg-gradient-to-r from-[#1a1a1a] to-transparent rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#025cca] to-[#0284c7] rounded-full"></div>
                        <h1 className="text-[#f5f5f5] text-base sm:text-lg font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Recent Orders
                        </h1>
                    </div>

                    {/* <button className="group text-[#025cca] text-xs sm:text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-300">
                        View All
                        <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                    </button> */}

                    <button
                        onClick={() => navigate('/orders')}
                        className="group text-[#025cca] text-xs sm:text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-300"
                    >
                        View All
                        <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Search */}
                <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#025cca]/20 to-[#0284c7]/20 rounded-[15px] blur-md group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative flex items-center gap-2 sm:gap-3 bg-[#1f1f24] rounded-[15px] px-3 sm:px-4 py-2 sm:py-3 border border-[#2a2a2a]/50 focus-within:border-[#025cca]/50 focus-within:shadow-lg focus-within:shadow-[#025cca]/10 transition-all duration-300">
                            <FaSearch className="text-[#025cca] text-sm sm:text-base transition-colors duration-300" />

                            <input
                                type="text"
                                placeholder="Search recent orders..."
                                className="bg-transparent outline-none text-[#f5f5f5] w-full text-xs sm:text-sm placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Order List - Scrollable Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 custom-scrollbar">
                    <div className="space-y-3 pb-4">
                        {
                            resData?.data.data.length > 0 ? (
                                resData.data.data.map((order) => {
                                    return <OrderList
                                        key={order._id}
                                        order={order}
                                        showDelete={false}  // ✅ Delete button hidden
                                    />
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#1f1f24] to-[#16161a] rounded-full flex items-center justify-center border border-[#2a2a2a]/50">
                                        <FaSearch className="text-gray-600 text-2xl" />
                                    </div>
                                    <p className="text-gray-500 text-sm">No orders available</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentOrders;
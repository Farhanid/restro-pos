import { useNavigate } from "react-router-dom";
import { popularDishes } from "../../constants/index";


const PopularDishes = () => {

    const navigate = useNavigate();

    return (
        <div className="mt-4 sm:mt-6 px-4 sm:pr-6">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] w-full rounded-2xl shadow-2xl border border-[#2a2a2a] overflow-hidden">

                {/* Header Section with Glass Morphism Effect */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#025cca]/10 to-transparent"></div>
                    <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 sm:h-7 bg-[#025cca] rounded-full"></div>
                            <h1 className="text-[#f5f5f5] text-base sm:text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Popular Dishes
                            </h1>
                        </div>

                        <a className="group relative overflow-hidden px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#025cca]/10 hover:bg-[#025cca]/20 transition-all duration-300 cursor-pointer">
                            <span className="text-[#025cca] text-xs sm:text-sm font-semibold relative z-10 group-hover:text-[#3d8eff] transition-colors">
                                View All →
                            </span>
                        </a>
                    </div>
                </div>

                {/* Scrollable Container with Custom Scrollbar */}
                <div className="overflow-y-auto h-[400px] sm:h-[450px] md:h-[500px] custom-scrollbar">

                    {popularDishes.map((dish, index) => {
                        return (
                            <div
                                key={dish.id}
                                className="group relative mx-3 sm:mx-4 md:mx-6 mb-2 sm:mb-3 transition-all duration-300 hover:scale-[1.02]"
                            >
                                {/* Hover Background Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#025cca]/0 via-[#025cca]/5 to-[#025cca]/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4 bg-[#1f1f1f] rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 py-3 sm:py-4 border border-[#2a2a2a] group-hover:border-[#025cca]/30 group-hover:shadow-lg transition-all duration-300">

                                    {/* Rank Number with Gradient */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#025cca] to-[#3d8eff] rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <h1 className="relative text-[#f5f5f5] font-bold text-base sm:text-lg md:text-xl mr-1 sm:mr-2 md:mr-4 min-w-[30px] sm:min-w-[35px] md:min-w-[40px] bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                            {dish.id < 10 ? `0${dish.id}` : dish.id}
                                        </h1>
                                    </div>

                                    {/* Dish Image with Glow Effect */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#025cca]/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full object-cover border-2 border-[#2a2a2a] group-hover:border-[#025cca] transition-all duration-300 shadow-md"
                                        />
                                    </div>

                                    {/* Dish Information */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base md:text-lg truncate group-hover:text-white transition-colors">
                                            {dish.name}
                                        </h1>
                                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ababab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                <p className="text-[#ababab] text-xs sm:text-sm font-medium">
                                                    Orders: <span className="text-[#f5f5f5] font-semibold">{dish.numberOfOrders.toLocaleString()}</span>
                                                </p>
                                            </div>

                                            {/* Order Trend Indicator (Optional - You can calculate based on data) */}
                                            <div className="flex items-center gap-1">
                                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                                <span className="text-green-500 text-xs font-medium">+12%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button on Hover */}
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#025cca] hover:bg-[#3d8eff] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium transform translate-x-2 group-hover:translate-x-0 transition-all">
                                        Order
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Add Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1a1a1a;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #025cca;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3d8eff;
                }
            `}</style>
        </div>
    )
}

export default PopularDishes
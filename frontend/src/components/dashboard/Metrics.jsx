import { itemsData, metricsData } from "../../constants"

const Metrics = () => {
    return (
        <div className="container mx-auto py-2 px-4 sm:px-6 md:px-4">

            {/* Overall Performance Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="w-full sm:w-auto">
                    <h2 className="font-semibold text-[#f5f5f5] text-lg sm:text-xl">
                        Overall Performance
                    </h2>
                    <p className="text-xs sm:text-sm text-[#ababab] mt-1 sm:mt-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, optio.
                    </p>
                </div>

                <button className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a] text-sm sm:text-base whitespace-nowrap">
                    Last 1 Month
                    <svg className="w-3 h-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </button>


            </div>

            {/* Metrics Grid */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {metricsData.map((metric, index) => {
                    return (
                        <div
                            key={index}
                            className="shadow-sm rounded-lg p-3 sm:p-4"
                            style={{ backgroundColor: metric.color }}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-xs sm:text-sm text-[#f5f5f5]">
                                    {metric.title}
                                </p>
                                <div className="flex items-center gap-1">
                                    <svg
                                        className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                                    >
                                        <path
                                            d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                        />
                                    </svg>
                                    <p
                                        className="font-medium text-xs sm:text-sm"
                                        style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                                    >
                                        {metric.percentage}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-1 font-semibold text-xl sm:text-2xl text-[#f5f5f5]">
                                {metric.value}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Item Details Section */}
            <div className="flex flex-col justify-between mt-8 sm:mt-10 md:mt-12">
                <div>
                    <h2 className="font-semibold text-[#f5f5f5] text-lg sm:text-xl">
                        Item Details
                    </h2>
                    <p className="text-xs sm:text-sm text-[#ababab] mt-1 sm:mt-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, optio.
                    </p>
                </div>

                {/* Items Grid */}
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {itemsData.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="shadow-sm rounded-lg p-3 sm:p-4"
                                style={{ backgroundColor: item.color }}
                            >
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-xs sm:text-sm text-[#f5f5f5]">
                                        {item.title}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <svg
                                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        >
                                            <path d="M5 15l7-7 7 7" />
                                        </svg>
                                        <p className="font-medium text-xs sm:text-sm text-[#f5f5f5]">
                                            {item.percentage}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-1 font-semibold text-xl sm:text-2xl text-[#f5f5f5]">
                                    {item.value}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Metrics
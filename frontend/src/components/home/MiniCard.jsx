const MiniCard = ({ title, icon, number, footerNum, isLoading }) => {
    const bgColor =
        title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]";

    // Format number for Total Earnings as currency
    const formattedNumber = title === "Total Earnings"
        ? `₹${number.toLocaleString('en-IN')}`
        : number;

    return (
        <div className="bg-[#1a1a1a] p-3 sm:p-4 md:p-5 rounded-lg w-full">
            {/* Top */}
            <div className="flex items-center justify-between">
                <h1 className="text-[#f5f5f5] text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                    {title}
                </h1>

                <div className={`${bgColor} p-2 sm:p-3 rounded-lg text-[#f5f5f5] text-xl sm:text-2xl`}>
                    {icon}
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-3 sm:mt-4 md:mt-5">
                {isLoading ? (
                    <div className="animate-pulse">
                        <div className="h-8 sm:h-10 md:h-12 bg-[#2a2a2a] rounded w-32 mb-2"></div>
                        <div className="h-4 bg-[#2a2a2a] rounded w-40"></div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-[#f5f5f5] text-2xl sm:text-3xl md:text-4xl font-bold">
                            {formattedNumber}
                        </h1>

                        <p className="text-[#f5f5f5] text-sm sm:text-base md:text-lg mt-1">
                            <span className="text-[#02ca3a]">
                                {footerNum}%
                            </span>{" "}
                            than yesterday
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default MiniCard;








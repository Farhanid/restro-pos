
import { useSelector } from "react-redux"
import { formatDate, getAvatarName } from "../../utils"
import { useState, useEffect } from "react"; // Added useEffect
import { useMemo } from "react";

const CustomerInfo = () => {
  const customerData = useSelector((state) => state.customer)
  const [dateTime, setDateTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);


  // Format time function
  const formatTime = (date) => {
    if (!date) return "Loading...";
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };


  return (
    <div>
      <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-2 sm:py-3 gap-2 sm:gap-3">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <h1 className="text-sm sm:text-md text-[#f5f5f5] font-semibold tracking-wide truncate w-full">
            {customerData.customerName || "Customer Name"}
          </h1>
          <p className="text-xs text-[#ababab] font-medium mt-0.5 sm:mt-1">
            #{customerData.orderId || "N/A"} / Dine in
          </p>

          {/* ✅ Fixed: Pass dateTime to formatDate and add dynamic time */}
          <p className="text-xs text-[#ababab] font-medium mt-1 sm:mt-2">
            {formatDate(dateTime)} at {formatTime(dateTime)}
          </p>
        </div>

        <button className="bg-[#f6b100] p-2 sm:p-2.5 md:p-3 text-base sm:text-lg md:text-xl font-bold rounded-lg min-w-[40px] sm:min-w-[45px] md:min-w-[50px]">
          {getAvatarName(customerData.customerName) || "CN"}
        </button>






      </div>
    </div>
  )
}

export default CustomerInfo
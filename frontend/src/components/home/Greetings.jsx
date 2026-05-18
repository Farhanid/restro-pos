import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

const Greetings = () => {

    const userData = useSelector(state => state.user)

    // ✅ Added missing state declaration
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time function
    const formatTime = (date) => {
        if (!date) return "00:00:00";
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    // ✅ Added missing formatDate function
    const formatDate = (date) => {
        if (!date) return "";
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = dateTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };


    // return (
    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 mt-3 md:mt-5 gap-4 md:gap-0">
    //         <div className="w-full md:w-auto">
    //             <h1 className="text-[#f5f5f5] text-xl sm:text-2xl md:text-3xl mb-1 md:mb-2 font-semibold tracking-wide">
    //                 {getGreeting()}, {userData.name || "TEST USER"}
    //             </h1>
    //             <p className="text-[#ababab] text-xs sm:text-sm">
    //                 Give your best services for customers 😉
    //             </p>
    //         </div>
    //         <div className="text-left md:text-right w-full md:w-auto">
    //             <h1 className="text-[#f5f5f5] text-2xl sm:text-3xl font-bold tracking-wide w-auto md:w-[130px]">
    //                 {formatTime(dateTime)}
    //             </h1>
    //             <p className="text-[#ababab] text-xs sm:text-sm">
    //                 {formatDate(dateTime)}
    //             </p>
    //         </div>
    //     </div>
    // )
    return (
        <div className="mx-3 md:mx-8 mt-4 md:mt-5">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 md:gap-0 bg-gradient-to-br from-[#111] via-[#181818] to-[#101010] border border-[#2a2a2a] rounded-[28px] px-4 sm:px-6 md:px-8 py-5 md:py-6 shadow-[0_0_25px_rgba(0,0,0,0.45)] overflow-hidden relative">

                {/* BACKGROUND GLOW */}
                <div className="absolute top-[-40px] right-[-40px] w-[120px] h-[120px] bg-orange-500/10 blur-3xl rounded-full"></div>

                {/* LEFT SECTION */}
                <div className="w-full z-10">

                    {/* TOP BADGE */}
                    <div className="flex items-center gap-2 mb-3">

                        <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.9)]"></div>

                        <p className="text-orange-400 text-xs sm:text-sm font-semibold tracking-[2px] uppercase">
                            Live Dashboard
                        </p>
                    </div>

                    {/* GREETING */}
                    <h1 className="text-[#f5f5f5] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">

                        {getGreeting()},

                        <span className="text-orange-400 block sm:inline sm:ml-2 mt-1 sm:mt-0">
                            {userData.name || "TEST USER"}
                        </span>

                    </h1>

                    {/* SUBTITLE */}
                    <p className="text-[#9f9f9f] text-sm sm:text-base mt-3 leading-relaxed max-w-[500px]">
                        Give your best services for customers 😉
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="w-full md:w-auto z-10">

                    <div className="bg-[#1a1a1a]/90 border border-[#303030] rounded-3xl px-5 sm:px-6 py-4 shadow-[0_0_20px_rgba(0,0,0,0.35)] backdrop-blur-lg">

                        {/* TIME */}
                        <h1 className="text-[#f5f5f5] text-3xl sm:text-4xl md:text-5xl font-black tracking-[4px] text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]">

                            {formatTime(dateTime)}

                        </h1>

                        {/* DATE */}
                        <div className="mt-3 flex justify-center">

                            <p className="text-[#ababab] text-xs sm:text-sm tracking-wide bg-[#222] px-4 py-1.5 rounded-full border border-[#333]">
                                {formatDate(dateTime)}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Greetings
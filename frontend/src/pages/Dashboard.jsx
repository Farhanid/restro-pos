import { BiSolidDish } from "react-icons/bi";
import { MdCategory, MdTableBar } from "react-icons/md";
import Metrics from "../components/dashboard/Metrics";
import RecentOrder from "../components/dashboard/RecentOrder";
import { useState } from "react";
import Modal from "../components/dashboard/Modal";

const Dashboard = () => {

    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Metrics");

    const handleOpenModal = (action) => {
        if (action === "table") setIsTableModalOpen(true);
    };

    const buttons = [
        { label: "Add Table", icon: <MdTableBar />, action: "table" },
        { label: "Add Category", icon: <MdCategory />, action: "category" },
        { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
    ];


    const tabs = ["Metrics", "Orders", "Payments"];

    return (
        <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden">

            <div className="container mx-auto px-4 sm:px-6 md:px-4 py-6 sm:py-10 md:py-14">

                {/* Buttons - Scrollable on mobile */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-0">

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                        {buttons.map(({ label, icon, action }) => (
                            <button
                                key={label}
                                onClick={() => handleOpenModal(action)}
                                className="bg-[#1a1a1a] hover:bg-[#262626] px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                            >
                                {label} {icon}
                            </button>
                        ))}
                    </div>

                    {/* Tabs - Scrollable on mobile */}
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-md flex items-center gap-2 whitespace-nowrap ${activeTab === tab
                                    ? "bg-[#262626]"
                                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 sm:mt-6 md:mt-0">
                    {activeTab === "Metrics" && <Metrics />}
                    {activeTab === "Orders" && <RecentOrder />}
                    {activeTab === "Payments" && (
                        <div className="text-white px-4 sm:px-6 py-8 text-center sm:text-left">
                            Payments Coming Soon...
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isTableModalOpen && (
                <Modal setIsTableModalOpen={setIsTableModalOpen} />
            )}


        </div>
    );
};

export default Dashboard;
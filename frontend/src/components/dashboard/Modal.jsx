import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { addTable } from "../../https";
import { enqueueSnackbar } from "notistack";

const Modal = ({ setIsTableModalOpen }) => {

    const [tableData, setTableData] = useState({
        tableNo: "",
        seats: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTableData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(tableData)
        tableMutation.mutate(tableData)
    }

    const handleCloseModal = () => {
        setIsTableModalOpen(false);
    };

    const tableMutation = useMutation({
        mutationFn: (reqData) => addTable(reqData),
        onSuccess: (data) => {
            setIsTableModalOpen(false);
            enqueueSnackbar(data.message, { variant: "error" })
        },
        onError: (error) => {
            const { data } = error.response;
            enqueueSnackbar(data.message, { variant: "error" })
            console.log(error)
        }
    })

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-[#262626] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-md md:max-w-lg mx-4 sm:mx-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[#f5f5f5] text-lg sm:text-xl font-semibold">
                        Add Table
                    </h2>

                    <button
                        onClick={handleCloseModal}
                        className="text-[#f5f5f5] hover:text-red-500 transition-colors"
                    >
                        <IoMdClose size={20} sm:size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-4 sm:mt-6 md:mt-10">
                    {/* Table Number */}
                    <div>
                        <label className="block text-[#ababab] mb-2 text-xs sm:text-sm font-medium">
                            Table Number
                        </label>
                        <input
                            name="tableNo"
                            type="text"
                            value={tableData.tableNo}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 bg-[#2a2a2a] text-white rounded-md outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                            required
                            placeholder="Enter table number"
                        />
                    </div>

                    {/* Seats */}
                    <div>
                        <label className="block text-[#ababab] mb-2 text-xs sm:text-sm font-medium">
                            Number of Seats
                        </label>
                        <input
                            name="seats"
                            type="number"
                            value={tableData.seats}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 bg-[#2a2a2a] text-white rounded-md outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
                            required
                            placeholder="Enter number of seats"
                            min="1"
                            max="20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 sm:py-2.5 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition text-sm sm:text-base"
                    >
                        Add Table
                    </button>
                </form>










            </motion.div>
        </div>
    );
};

export default Modal;
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BackButton from "../components/shared/BackButton"
import BottomNav from "../components/shared/BottomNav"
import TableCard from "../components/tables/TableCard"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getTables } from "../https"
import { enqueueSnackbar } from "notistack"

const Tables = () => {

    const [status, setStatus] = useState('all')

    const { data: resData, isError, isLoading } = useQuery({
        queryKey: ["tables"],
        queryFn: async () => {
            return await getTables();
        },
        placeholderData: keepPreviousData
    });

    if (isError) {
        enqueueSnackbar("Something went wrong!", { variant: "error" })
    }

    // ✅ Transform tables: If status is "Booked" but currentOrder is null, change status to "Available"
    const transformedTables = resData?.data?.data?.map(table => {
        if (table.status === "Booked" && !table.currentOrder) {
            return { ...table, status: "Available" };
        }
        return table;
    });

    // Filter tables based on status (case insensitive)
    const filteredTables = transformedTables?.filter(table => {
        if (status === 'all') return true;
        // Compare both in lowercase to handle "Booked" vs "booked"
        return table.status?.toLowerCase() === status.toLowerCase();
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const headerVariants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 12,
                duration: 0.5,
            },
        },
    }

    const buttonVariants = {
        hidden: { y: -30, opacity: 0, scale: 0.9 },
        visible: (custom) => ({
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 15,
                delay: custom * 0.1,
            },
        }),
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
        tap: {
            scale: 0.95,
        },
    }

    const tablesContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3,
            },
        },
    }

    const tableCardVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
        exit: {
            y: -30,
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.3,
            },
        },
        hover: {
            y: -5,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
            },
        },
    }

    const loadingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.8,
            },
        },
    }

    const emptyStateVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    }

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col pb-16 lg:pb-0"
        >
            {/* Header */}
            <motion.div
                variants={headerVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 mt-1 sm:mt-2"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <BackButton />
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider"
                    >
                        Tables
                    </motion.h1>
                </div>

                <motion.div
                    variants={containerVariants}
                    className="flex items-center gap-2 sm:gap-4"
                >
                    {['all', 'available', 'booked'].map((statusType, index) => {
                        const getButtonText = () => {
                            if (statusType === 'all') return 'All';
                            if (statusType === 'available') return 'Available';
                            return 'Booked';
                        }

                        return (
                            <motion.button
                                key={statusType}
                                custom={index}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={() => setStatus(statusType)}
                                className={`text-[#ababab] text-sm sm:text-base md:text-lg ${status === statusType && "bg-[#383838] rounded-lg"
                                    } px-3 sm:px-4 md:px-5 py-1 sm:py-2 font-semibold transition-all duration-200`}
                            >
                                {getButtonText()}
                            </motion.button>
                        )
                    })}
                </motion.div>
            </motion.div>

            {/* Scrollable content */}
            <motion.div
                variants={tablesContainerVariants}
                className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-3 sm:py-4"
            >
                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-center">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                variants={loadingVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="text-center py-10 w-full"
                            >
                                <div className="inline-block w-8 h-8 border-4 border-[#f6b100] border-t-transparent rounded-full animate-spin"></div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[#ababab] mt-2"
                                >
                                    Loading tables...
                                </motion.p>
                            </motion.div>
                        ) : filteredTables?.length > 0 ? (
                            filteredTables.map((table, index) => (
                                <motion.div
                                    key={table._id}
                                    variants={tableCardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                    whileHover="hover"
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <TableCard
                                        key={table._id}
                                        id={table._id}
                                        name={table.tableNo}
                                        status={table.status}
                                        initials={table?.currentOrder?.customerDetails?.name}
                                        seats={table.seats}
                                        currentOrder={table?.currentOrder}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                key="empty"
                                variants={emptyStateVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="text-center py-10 w-full"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="inline-block"
                                >
                                    <svg className="w-20 h-20 text-[#ababab] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M6 14h6m-6 4h12M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
                                    </svg>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[#ababab] text-lg"
                                >
                                    No tables available
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[#ababab] text-sm mt-1"
                                >
                                    Tables will appear here once added
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Bottom nav */}
            <BottomNav />
        </motion.section>
    )
}

export default Tables
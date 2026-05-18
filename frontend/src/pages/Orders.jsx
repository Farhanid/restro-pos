import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import OrderCard from "../components/orders/OrderCard"
import BackButton from "../components/shared/BackButton"
import BottomNav from "../components/shared/BottomNav"
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOrders, deleteOrder, updateOrder } from "../https"
import { enqueueSnackbar } from "notistack"

const Orders = () => {

  const [status, setStatus] = useState('all')
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "POS | Orders"
  }, [])

  const { data: resData, isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  })

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      // Refetch orders after successful deletion
      queryClient.invalidateQueries(["orders"]);
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to delete order!",
        { variant: "error" }
      );
    },
  })

  // ✅ Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }) => updateOrder(id, data),
    onSuccess: () => {
      // Refetch orders after successful status update
      queryClient.invalidateQueries(["orders"]);
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(
        error.response?.data?.message || "Failed to update order status!",
        { variant: "error" }
      );
    },
  })

  const handleDeleteOrder = async (orderId) => {
    return deleteOrderMutation.mutateAsync(orderId);
  }

  // ✅ Handle status update
  const handleUpdateStatus = async (orderId, statusData) => {
    return updateOrderMutation.mutateAsync({ id: orderId, data: statusData });
  }

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" })
  }

  // Filter orders based on status
  const filteredOrders = resData?.data?.data?.filter(order => {
    if (status === 'all') return true;
    if (status === 'progress') return order.orderStatus?.toLowerCase() === 'in progress';
    if (status === 'ready') return order.orderStatus?.toLowerCase() === 'ready';
    if (status === 'completed') return order.orderStatus?.toLowerCase() === 'completed';
    return true;
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

  const ordersContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  }

  const orderCardVariants = {
    hidden: { x: -30, opacity: 0, scale: 0.95 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      x: 100,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
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
      <motion.div variants={headerVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 mt-1 sm:mt-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <BackButton />
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider"
          >
            Orders
          </motion.h1>
        </div>

        {/* Status Buttons - Scrollable on mobile */}
        <motion.div
          variants={containerVariants}
          className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0"
        >
          {['all', 'progress', 'ready', 'completed'].map((statusType, index) => {
            const getButtonText = () => {
              if (statusType === 'all') return 'All';
              if (statusType === 'progress') return 'In Progress';
              if (statusType === 'ready') return 'Ready';
              return 'Completed';
            }

            return (
              <motion.button
                key={statusType}
                custom={index}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setStatus(statusType)}
                className={`text-[#ababab] text-sm sm:text-base md:text-lg whitespace-nowrap ${status === statusType && "bg-[#383838] rounded-lg px-3 sm:px-4 md:px-5 py-1 sm:py-2"
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
        variants={ordersContainerVariants}
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
                  Loading orders...
                </motion.p>
              </motion.div>
            ) : filteredOrders?.length > 0 ? (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  variants={orderCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  transition={{ delay: index * 0.05 }}
                >
                  <OrderCard
                    order={order}
                    onDelete={handleDeleteOrder}
                    onUpdateStatus={handleUpdateStatus}
                    showDelete={true}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#ababab] text-lg"
                >
                  No orders available
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#ababab] text-sm mt-1"
                >
                  Orders will appear here once created
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom nav (fixed) */}
      <BottomNav />
    </motion.section>
  )
}

export default Orders

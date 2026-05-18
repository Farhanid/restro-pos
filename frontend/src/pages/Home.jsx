import { motion, AnimatePresence } from "framer-motion";
import RecentOrder from "../components/dashboard/RecentOrder";
import Greetings from "../components/home/Greetings"
import MiniCard from "../components/home/MiniCard"
import PopularDishes from "../components/home/PopularDishes";
import RecentOrders from "../components/home/RecentOrders";
import BottomNav from "../components/shared/BottomNav"
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../https";

const Home = () => {


  // Fetch orders data
  const { data: resData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
  });

  // Calculate total earnings from all orders (sum of totalWithTax)
  const calculateTotalEarnings = () => {
    if (!resData?.data?.data) return 0;
    return resData.data.data.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);
  };

  // Calculate in-progress orders count (In Progress + Ready status)
  const calculateInProgressOrders = () => {
    if (!resData?.data?.data) return 0;
    return resData.data.data.filter(order =>
      order.orderStatus === "In Progress" || order.orderStatus === "Ready"
    ).length;
  };

  const totalEarnings = calculateTotalEarnings();
  const inProgressOrders = calculateInProgressOrders();

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
  };

  const leftSectionVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6,
      },
    },
  };

  const rightSectionVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6,
        delay: 0.2,
      },
    },
  };

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  const greetingsVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.1,
      },
    },
  };

  const recentOrdersVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col lg:flex-row gap-3 pb-16 lg:pb-0'
    >
      {/* Left div - Main Content */}
      <motion.div
        variants={leftSectionVariants}
        className="flex-1 lg:flex-3 w-full lg:w-auto"
      >
        <motion.div variants={greetingsVariants}>
          <Greetings />
        </motion.div>

        <motion.div
          variants={cardsContainerVariants}
          className="flex flex-col sm:flex-row items-center w-full gap-3 px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8"
        >
          <motion.div
            variants={cardVariants}
            className="w-full sm:w-1/2"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <MiniCard
              title='Total Earnings'
              icon={<BsCashCoin />}
              number={totalEarnings}
              footerNum={1.6}
              isLoading={isLoading}
            />
          </motion.div>
          <motion.div
            variants={cardVariants}
            className="w-full sm:w-1/2"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <MiniCard
              title='In Progress'
              icon={<GrInProgress />}
              number={inProgressOrders}
              footerNum={3.6}
              isLoading={isLoading}
            />
          </motion.div>
        </motion.div>

        <motion.div variants={recentOrdersVariants}>
          <RecentOrders />
        </motion.div>
      </motion.div>

      {/* Right div - Popular Dishes */}
      <motion.div
        variants={rightSectionVariants}
        className="flex-1 lg:flex-2 w-full lg:w-auto mt-4 lg:mt-0"
      >
        <PopularDishes />
      </motion.div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </motion.section>
  )
}

export default Home









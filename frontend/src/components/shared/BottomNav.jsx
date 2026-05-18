import { FaHome, FaTable } from "react-icons/fa";
import { IoReorderFour } from "react-icons/io5";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomerName } from "../../redux/slices/customerSlice";

const BottomNav = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [name, setName] = useState();
  const [phone, setPhone] = useState()

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  }

  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    //send the data to store
    dispatch(setCustomerName({
      name, phone, guests: guestCount
    }))
    navigate("/tables")
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-14 sm:h-16 flex justify-around items-center">

        <button
          onClick={() => navigate("/")}
          className={`flex flex-col sm:flex-row items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
            } w-full sm:w-[200px] md:w-[250px] lg:w-[300px] rounded-[20px] py-1 sm:py-2 mx-0.5 sm:mx-1`}
        >
          <FaHome className='inline mb-0.5 sm:mb-0 sm:mr-2' size={18} sm:size={20} lg:size={30} />
          <p className="text-[10px] sm:text-xs md:text-sm">Home</p>
        </button>

        <button
          onClick={() => navigate("/orders")}
          className={`flex flex-col sm:flex-row items-center justify-center font-bold ${isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
            } w-full sm:w-[200px] md:w-[250px] lg:w-[300px] rounded-[20px] py-1 sm:py-2 mx-0.5 sm:mx-1`}
        >
          <IoReorderFour className='inline mb-0.5 sm:mb-0 sm:mr-2' size={18} sm:size={20} lg:size={30} />
          <p className="text-[10px] sm:text-xs md:text-sm">Orders</p>
        </button>

        <button
          onClick={() => navigate("/tables")}
          className={`flex flex-col sm:flex-row items-center justify-center font-bold ${isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
            } w-full sm:w-[200px] md:w-[250px] lg:w-[300px] rounded-[20px] py-1 sm:py-3 mx-0.5 sm:mx-1`}
        >
          <FaTable className='inline mb-0.5 sm:mb-0 sm:mr-2' size={18} sm:size={20} lg:size={30} />
          <p className="text-[10px] sm:text-xs md:text-sm">Tables</p>
        </button>

        <button
          onClick={() => navigate("/history")}
          className={`flex flex-col sm:flex-row items-center justify-center font-bold ${isActive("/more") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
            } w-full sm:w-[200px] md:w-[250px] lg:w-[300px] rounded-[20px] py-1 sm:py-3 mx-0.5 sm:mx-1`}
        >
          <CiCircleMore className='inline mb-0.5 sm:mb-0 sm:mr-2' size={18} sm:size={20} lg:size={30} />
          <p className="text-[10px] sm:text-xs md:text-sm">History</p>
        </button>

        <button
          disabled={isActive("/tables") || isActive("/menu")}
          onClick={openModal}
          className="bg-[#F6B100] absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 text-[#f5f5f5] rounded-full p-1.5 sm:p-3 md:p-3 items-center shadow-lg"
        >
          <BiSolidDish size={20} sm:size={24} md:size={30} />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">
            Customer Name
          </label>

          <div className="bg-[#1f1f1f] px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter customer name"
              className="w-full bg-transparent text-white outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-2 text-sm font-medium text-[#ababab]">
            Customer Phone
          </label>

          <div className="bg-[#1f1f1f] px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="number"
              placeholder="+91 9383323682"
              className="w-full bg-transparent text-white outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">Guest</label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-3 sm:px-4 py-2 sm:py-3 rounded-lg">
            <button onClick={decrement} className="text-yellow-500 text-xl sm:text-2xl px-2">&minus;</button>
            <span className="text-white text-sm sm:text-base">{guestCount} Person</span>
            <button onClick={increment} className="text-yellow-500 text-xl sm:text-2xl px-2">&#43;</button>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-2 sm:py-3 mt-6 sm:mt-8 hover:bg-yellow-700 text-sm sm:text-base"
        >
          Create Order
        </button>

      </Modal>
    </>
  )
}

export default BottomNav
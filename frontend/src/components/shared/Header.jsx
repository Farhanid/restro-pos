import { useDispatch, useSelector } from 'react-redux';
import logo from '../../assets/images/logo.png'
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { IoLogOut } from 'react-icons/io5';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../https';
import { removeUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { useState } from 'react';

const Header = () => {

  const userData = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data)
      dispatch(removeUser())
      navigate("/auth")
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center py-3 sm:py-4 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-[#1a1a1a] to-[#141414] border-b border-[#2a2a2a] shadow-xl' >
      {/* Logo */}
      <div onClick={() => navigate("/")} className='flex items-center gap-2 md:gap-3 cursor-pointer group'>
        <div className='relative'>
          <img src={logo} alt="restro logo" className='w-7 h-7 md:w-9 md:h-9 object-contain transition-transform group-hover:scale-105 duration-300' />
          <div className='absolute inset-0 bg-gradient-to-r from-[#f6b100]/20 to-transparent rounded-full blur-md group-hover:blur-lg transition-all duration-300'></div>
        </div>
        <div className='flex flex-col'>
          <h1 className='text-base md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
            Restro
          </h1>
        </div>
      </div>

      {/* Search - Desktop */}
      {/* <div className='hidden md:flex items-center gap-3 bg-[#1f1f1f] rounded-full px-5 py-2.5 w-[300px] lg:w-[450px] border border-[#2a2a2a] focus-within:border-[#f6b100] focus-within:shadow-lg transition-all duration-300 group'>
        <FaSearch className='text-[#ababab] text-lg group-focus-within:text-[#f6b100] transition-colors' />
        <input
          type="text"
          placeholder="Search orders, tables, dishes..."
          className='bg-transparent outline-none text-[#f5f5f5] w-full text-sm placeholder:text-[#ababab] placeholder:text-xs'
        />
      </div> */}

      {/* Mobile Search Button */}
      <div className='md:hidden bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] rounded-full p-2.5 cursor-pointer border border-[#2a2a2a] shadow-md active:scale-95 transition-all duration-200'
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
        <FaSearch className='text-[#f5f5f5] text-base' />
      </div>

      {/* Logged user details */}
      <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
        {/* Dashboard Button */}
        <div onClick={() => navigate("/dashboard")}
          className='relative bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] rounded-full p-2.5 md:p-3 cursor-pointer border border-[#2a2a2a] hover:border-[#f6b100] transition-all duration-300 group shadow-md'>
          <MdDashboard className='text-[#f5f5f5] text-lg md:text-xl group-hover:text-[#f6b100] transition-colors' />
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#f6b100]/0 to-[#f6b100]/10 opacity-0 group-hover:opacity-100 transition-opacity'></div>
        </div>

        {/* Notification Button with Badge */}
        <div className='relative'>
          <div className='relative bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] rounded-full p-2.5 md:p-3 cursor-pointer border border-[#2a2a2a] hover:border-[#f6b100] transition-all duration-300 group shadow-md'>
            <FaBell className='text-[#f5f5f5] text-lg md:text-xl group-hover:text-[#f6b100] transition-colors' />
            <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f6b100] rounded-full border-2 border-[#1a1a1a] animate-pulse'></span>
          </div>
        </div>

        {/* User Info Section */}
        <div className='flex items-center gap-2 md:gap-3 cursor-pointer group'>
          {/* User Avatar */}
          <div className='relative'>
            <FaUserCircle className='text-[#f5f5f5] text-3xl md:text-4xl group-hover:text-[#f6b100] transition-colors duration-300' />
            <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#f6b100]/0 to-[#f6b100]/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
          </div>

          {/* User Info - Hide on very small screens */}
          <div className='hidden sm:flex flex-col items-start'>
            <h1 className='text-sm md:text-base text-[#f5f5f5] font-semibold tracking-wide group-hover:text-[#f6b100] transition-colors'>
              {userData.name || "TEST USER"}
            </h1>
            <div className='flex items-center gap-1.5 mt-0.5'>
              <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
              <p className='text-[10px] md:text-xs text-[#ababab] font-medium uppercase tracking-wider'>
                {userData.role || "ROLE"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className='relative'>
            <IoLogOut
              onClick={handleLogout}
              className="text-[#f5f5f5] text-2xl md:text-3xl cursor-pointer hover:text-red-500 transition-all duration-300 hover:scale-110 active:scale-95"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Modal/Dropdown - Improved Design */}
      {isMobileSearchOpen && (
        <div className='fixed top-[68px] left-0 right-0 z-50 md:hidden bg-gradient-to-b from-[#1a1a1a] to-[#141414] px-4 py-4 shadow-2xl border-b border-[#2a2a2a] animate-slideDown'>
          <div className='flex items-center gap-3 bg-[#1f1f1f] rounded-full px-5 py-3 w-full border border-[#2a2a2a] focus-within:border-[#f6b100] transition-all duration-300'>
            <FaSearch className='text-[#ababab] text-base' />
            <input
              type="text"
              placeholder="Search orders, tables, dishes..."
              autoFocus
              className='bg-transparent outline-none text-[#f5f5f5] w-full text-sm placeholder:text-[#ababab]'
              onBlur={() => setTimeout(() => setIsMobileSearchOpen(false), 200)}
            />
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}

export default Header









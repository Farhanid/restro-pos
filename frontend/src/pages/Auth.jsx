import restaurant from '../assets/images/restaurant-img.jpg'
import logo from '../assets/images/logo.png'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import { useState } from 'react'

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false)

  const toggleAuthMode = (e) => {
    e.preventDefault(); // Prevent any default behavior
    setIsRegister(!isRegister);
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">

      {/* Left Section */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center overflow-hidden">
        <img
          src={restaurant}
          alt="Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <blockquote className="relative z-10 bottom-10 px-8 text-2xl italic text-white">
          "Serve customers the best food with prompt friendly service in a welcoming atmosphere, and they'll keep coming back"
          <span className="block mt-4 text-yellow-400">
            - Founder of Restro
          </span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className='flex flex-col items-center gap-2'>
          <img src={logo} alt="Restro Logo" className='w-14 h-14 border-2 rounded-full p-1' />
          <h1 className='text-lg font-semibold text-[#f5f5f5] tracking-wide'>Restro</h1>
        </div>

        <h2 className='text-4xl text-center mt-10 font-semibold text-yellow-400 mb-10'>
          {isRegister ? "Employee Registration" : "Employee Login"}
        </h2>

        {/* Components */}
        {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}

        <div className='flex justify-center mt-6'>
          <p className='text-sm text-[#ababab]'>
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={toggleAuthMode}
              className='text-yellow-400 font-semibold hover:underline ml-1 bg-transparent border-none cursor-pointer'
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>

















    </div>
  )
}

export default Auth
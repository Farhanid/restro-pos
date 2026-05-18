import { MdRestaurantMenu } from "react-icons/md";
import BackButton from "../components/shared/BackButton"
import BottomNav from "../components/shared/BottomNav"
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {

  const customerData = useSelector(state => state.customer)

  return (
    <section className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col lg:flex-row gap-3 pb-24 lg:pb-0" >

      {/* Left div  */}

      <div className="flex-1 lg:flex-[3]" >

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-10 py-4 mt-2 gap-4">

          <div className="flex items-center gap-4" >
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>

          <div className="flex items-center gap-4">

            <div className='flex items-center gap-3 cursor-pointer' >
              <MdRestaurantMenu className='text-[#f5f5f5] text-3xl sm:text-4xl' />

              <div className='flex flex-col items-start' >
                <h1 className='text-sm sm:text-md text-[#f5f5f5] font-semibold' >
                  {customerData.customerName || "Customer Name"}
                </h1>

                <p className='text-xs text-[#ababab] font-medium ' >
                  Table : {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>

          </div>
        </div>

        <MenuContainer />
      </div>

      {/* Right div  */}

      <div className="w-full lg:flex-1 bg-[#1a1a1a] mt-0 lg:mt-4 mx-3 lg:mr-3 lg:ml-0 rounded-lg pt-2 lg:h-[780px]" >

        {/*Customer Info */}
        <CustomerInfo />

        <hr className="border-[#2a2a2a] border-t-2 " />

        {/* Cart Items */}
        <CartInfo />

        <hr className="border-[#2a2a2a] border-t-2 " />

        {/*Bills */}
        <Bill />

      </div>

      <BottomNav />

    </section>
  )
}

export default Menu
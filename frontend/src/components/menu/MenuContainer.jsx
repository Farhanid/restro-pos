import { GrRadialSelected } from "react-icons/gr";
import { menus } from "../../constants";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";

const MenuContainer = () => {
    const [selected, setSelected] = useState(menus[0]);
    const dispatch = useDispatch();

    // ✅ store count per item
    const [counts, setCounts] = useState({});

    // ✅ increment per item
    const increment = (id) => {
        setCounts((prev) => ({
            ...prev,
            [id]: prev[id] ? Math.min(prev[id] + 1, 4) : 1
        }));
    };

    // ✅ decrement per item
    const decrement = (id) => {
        setCounts((prev) => ({
            ...prev,
            [id]: prev[id] ? Math.max(prev[id] - 1, 0) : 0
        }));
    };

    // ✅ FIXED: Use counts[item.id] instead of itemCount
    const handleAddToCart = (item) => {
        const itemCount = counts[item.id] || 0;

        if (itemCount === 0) return;

        const { name, price } = item;
        const newObj = {
            id: Date.now(), // ✅ Use timestamp instead of Date object
            name,
            pricePerQuantity: price,
            quantity: itemCount,
            price: price * itemCount
        };

        dispatch(addItems(newObj));

        // ✅ FIXED: Reset count for this specific item
        setCounts((prev) => ({
            ...prev,
            [item.id]: 0
        }));
    };



    return (
        <>
            {/* CATEGORY LIST */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 w-full">
                {menus.map((menu) => {
                    return (
                        <div
                            key={menu.id}
                            className="flex flex-col items-start justify-between p-3 sm:p-4 rounded-lg h-auto sm:h-[100px] cursor-pointer"
                            onClick={() => {
                                setSelected(menu);
                            }}
                            style={{ backgroundColor: menu.bgColor }}
                        >
                            <div className="flex items-center justify-between w-full">
                                <h1 className="text-[#f5f5f5] text-sm sm:text-base md:text-lg font-semibold">
                                    <span className="inline sm:inline">{menu.icon}</span> {menu.name}
                                </h1>

                                {selected.id === menu.id && (
                                    <GrRadialSelected className="text-white" size={16} sm:size={20} />
                                )}
                            </div>

                            <p className="text-[#ababab] text-xs sm:text-sm font-semibold">
                                {menu.items.length} Items
                            </p>
                        </div>
                    );
                })}
            </div>

            <hr className="border-[#2a2a2a] border-t-2 mt-3 sm:mt-4" />

            {/* ITEMS LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 w-full">
                {selected?.items.map((item) => {
                    const itemCount = counts[item.id] || 0;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col items-start justify-between p-3 sm:p-4 rounded-lg h-auto sm:h-[150px] hover:bg-[#2a2a2a] transition-colors"
                        >
                            <div className="flex items-start justify-between w-full gap-2">
                                <h1 className="text-[#f5f5f5] text-sm sm:text-base md:text-lg font-semibold">
                                    {item.name}
                                </h1>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className={`p-1.5 sm:p-2 rounded-lg cursor-pointer transition-colors ${itemCount === 0
                                        ? 'bg-[#2a4e2a] text-[#02ca3a]'
                                        : 'bg-[#02ca3a] text-white'
                                        }`}>

                                    <FaShoppingCart size={16} sm:size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0 mt-3 sm:mt-0">
                                <p className="text-[#f5f5f5] text-lg sm:text-xl font-bold">
                                    ${item.price}
                                </p>

                                <div className="flex items-center gap-2 sm:gap-4 bg-[#1f1f1f] px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                                    <button
                                        onClick={() => decrement(item.id)}
                                        className="text-yellow-500 text-xl sm:text-2xl hover:text-yellow-400"
                                        disabled={itemCount === 0}
                                    >
                                        &minus;
                                    </button>

                                    <span className="text-white min-w-[20px] text-center text-sm sm:text-base">
                                        {itemCount}
                                    </span>

                                    <button
                                        onClick={() => increment(item.id)}
                                        className="text-yellow-500 text-xl sm:text-2xl hover:text-yellow-400"
                                        disabled={itemCount === 4}
                                    >
                                        &#43;
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MenuContainer;

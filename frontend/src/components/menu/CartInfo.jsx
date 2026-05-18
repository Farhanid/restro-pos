import { FaNotesMedical } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import { useEffect, useRef, useState } from "react";

const CartInfo = () => {
    const cartData = useSelector(state => state.cart);
    const scrolLRef = useRef()
    const dispatch = useDispatch();
    const [selectedItemForNote, setSelectedItemForNote] = useState(null);

    useEffect(() => {
        if (scrolLRef.current) {
            scrolLRef.current.scrollTo({
                top: scrolLRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [cartData])

    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    const handleAddNote = (item) => {
        setSelectedItemForNote(item);
        // You can open a modal or prompt here
        const note = prompt("Add special instructions for " + item.name + ":", item.note || "");
        if (note !== null) {
            // Dispatch action to add note (you'll need to add this to your slice)
            console.log("Note for", item.name, ":", note);
        }
        setSelectedItemForNote(null);
    };


    // Calculate total
    const totalAmount = cartData.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <div>
            <div className="px-4 py-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
                        Order Details
                    </h1>
                    {cartData.length > 0 && (
                        <span className="text-xs text-[#ababab] bg-[#1f1f1f] px-2 py-1 rounded-full">
                            {cartData.length} items
                        </span>
                    )}
                </div>

                <div className="mt-4 overflow-y-scroll scrollbar-hide h-[380px]" ref={scrolLRef} >
                    {cartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-[#ababab] text-sm">Cart is empty.</p>
                            <p className="text-[#ababab] text-xs mt-2">Start adding items!</p>
                        </div>
                    ) : (
                        <>
                            {cartData.map((item) => {
                                // Calculate unit price if needed
                                const unitPrice = item.pricePerQuantity || (item.price / item.quantity);

                                return (
                                    <div key={item.id} className="bg-[#1f1f1f] rounded-lg px-4 py-4 mb-2">
                                        <div className="flex items-center justify-between">
                                            <h1 className="text-[#ababab] font-semibold tracking-wide text-md">
                                                {item.name}
                                            </h1>
                                            <p className="text-[#ababab] font-semibold">
                                                x{item.quantity}
                                            </p>
                                        </div>

                                        {item.note && (
                                            <p className="text-xs text-yellow-500 mt-1 italic">
                                                Note: {item.note}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-3">
                                                <RiDeleteBin2Fill
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-[#ababab] cursor-pointer hover:text-red-500 transition-colors"
                                                    size={20}
                                                />
                                                <FaNotesMedical
                                                    onClick={() => handleAddNote(item)}
                                                    className="text-[#ababab] cursor-pointer hover:text-yellow-500 transition-colors"
                                                    size={20}
                                                />
                                            </div>

                                            <p className="text-[#f5f5f5] text-md font-bold">
                                                ${item.price}
                                            </p>
                                        </div>

                                        {/* Show unit price for transparency */}
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-[#ababab] text-right mt-1">
                                                ${unitPrice} each
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            {/* ✅ Add total section */}
                            <div className="bg-[#262626] rounded-lg px-4 py-3 mt-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-[#f5f5f5] font-semibold">Total</h2>
                                    <p className="text-[#f5f5f5] text-xl font-bold">
                                        ${totalAmount}
                                    </p>
                                </div>
                            </div>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};






export default CartInfo;






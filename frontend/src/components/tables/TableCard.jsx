import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";

const TableCard = ({ name, status, initials, seats, id, currentOrder }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const bg = getBgColor();

    // Normalize status to check if it's booked (case insensitive)
    const isBooked = status?.toLowerCase() === "booked";

    const handleClick = () => {
        const table = { tableId: id, tableNo: name };
        dispatch(updateTable({ table }));

        if (isBooked) {
            // Navigate to view order page
            navigate(`/orders`);
        } else {
            // Navigate to create order (menu)
            navigate('/menu');
        }
    };

    return (
        <div
            onClick={handleClick}
            key={id}
            className="w-75 bg-[#262626] hover:bg-[#1f1f1f] px-4 pb-10 pt-6 rounded-lg mb-4 cursor-pointer shadow-lg"
        >
            <div className="flex items-center justify-between px-1">
                <h1 className="text-[#f5f5f5] text-xl font-semibold">
                    Table  <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />  {name}
                </h1>

                <p
                    className={`${isBooked
                        ? "text-green-600 bg-[#2e4a40]"
                        : "bg-[#f6b100] text-white"
                        } px-2 py-1 rounded-lg capitalize`}
                >
                    {status}
                </p>
            </div>

            <div className="flex items-center justify-center mt-5 mb-9">
                <div
                    className={`${bg} w-15 h-15 flex items-center justify-center text-white rounded-full text-xl font-semibold`}
                    style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
                >
                    {getAvatarName(initials) || "N/A"}
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                <p className="text-[#f5f5f5]">Seats:</p>
                <p className="text-[#f5f5f5]">{seats}</p>
            </div>

            {isBooked ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className="w-full bg-green-600 text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-green-700"
                >
                    View Order
                </button>
            ) : (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700"
                >
                    Create Order
                </button>
            )}
        </div>
    );
};

export default TableCard;
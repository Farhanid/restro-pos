import { useDispatch, useSelector } from "react-redux"
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice"
import { useState } from "react"
import { enqueueSnackbar } from "notistack"
import { addOrder, createOrderRazorPay, updateTable, verifyPaymentRazorPay } from "../../https/index"
import { useMutation } from "@tanstack/react-query"
import { removeCustomer } from "../../redux/slices/customerSlice"

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Bill = () => {

  const dispatch = useDispatch();

  const customerData = useSelector(state => state.customer)
  const cartData = useSelector(state => state.cart)
  const total = useSelector(getTotalPrice)
  const taxRate = 5.25
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning"
      });
      return;
    }

    // For Cash payment, skip Razorpay
    if (paymentMethod === "Cash") {
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests
        },
        orderStatus: "In Progress",
        bills: {
          total: Math.round(total),
          tax: Math.round(tax),
          totalWithTax: Math.round(totalPriceWithTax),
          paymentMethod: "Cash"
        },
        items: cartData,
        table: customerData.table.tableId
      };
      orderMutation.mutate(orderData);
      return;
    }

    // For Online payment, proceed with Razorpay
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      )
      if (!res) {
        enqueueSnackbar("Razor pay SDK failed to load. Are you online?", {
          variant: "warning"
        })
        return;
      }

      // Round the amount to nearest integer (no decimals)
      const roundedAmount = Math.round(totalPriceWithTax);

      const reqData = {
        amount: roundedAmount  // Send as integer like 600, 499, 502
      }

      console.log("Sending amount:", reqData); // Will show e.g., {amount: 600}

      const { data } = await createOrderRazorPay(reqData)

      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "RESTRO",
        description: "Secure Payment for Your Meal",
        order_id: data.order.id,
        handler: async function (response) {
          const verification = await verifyPaymentRazorPay(response);
          console.log(verification);
          enqueueSnackbar(verification.data.message, { variant: "success" });

          // Place the order
          const orderData = {
            customerDetails: {
              name: customerData.customerName,
              phone: customerData.customerPhone,
              guests: customerData.guests
            },
            orderStatus: "In Progress",
            bills: {
              total: Math.round(total),
              tax: Math.round(tax),
              totalWithTax: Math.round(totalPriceWithTax),
              paymentMethod: "Online",
              paymentId: response.razorpay_payment_id
            },
            items: cartData,
            table: customerData.table.tableId
          };

          orderMutation.mutate(orderData);
        },
        prefill: {
          name: customerData.customerName || customerData.name,
          email: "",
          contact: customerData.customerPhone || customerData.phone,
        },
        theme: { color: "#025cca" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error)
      enqueueSnackbar(error.response?.data?.message || "Payment failed!", {
        variant: "error"
      });
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      // Update table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table
      }

      tableUpdateMutation.mutate(tableData);

      enqueueSnackbar("Order Placed!", {
        variant: "success"
      });
    },
    onError: (error) => {
      console.log(error)
      enqueueSnackbar("Failed to place order!", { variant: "error" });
    }
  })





  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData)
      dispatch(removeCustomer())
      dispatch(removeAllItems())
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [paymentMethod, setPaymentMethod] = useState()






  const handlePrintReceipt = () => {
    const printWindow = window.open('', '_blank');

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${customerData.customerName}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            padding: 20px;
            margin: 0;
            background: white;
          }
          .receipt {
            max-width: 300px;
            margin: 0 auto;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
          }
          .header p {
            margin: 5px 0;
            font-size: 12px;
          }
          .items {
            width: 100%;
            margin-bottom: 10px;
          }
          .items th, .items td {
            padding: 5px 0;
            text-align: left;
          }
          .items th {
            border-bottom: 1px solid #ddd;
          }
          .items td:last-child {
            text-align: right;
          }
          .total {
            border-top: 1px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .grand-total {
            font-size: 16px;
            font-weight: bold;
            border-top: 1px solid #000;
            padding-top: 5px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            border-top: 1px dashed #000;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 12px;
          }
          @media print {
            body {
              margin: 0;
              padding: 10px;
            }
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>RESTRO</h1>
            <p>Restaurant Management System</p>
            <p>${new Date().toLocaleString()}</p>
            <p>Order #${Math.floor(Math.random() * 10000)}</p>
          </div>

          <div class="customer-info">
            <p><strong>Customer:</strong> ${customerData.customerName}</p>
            <p><strong>Phone:</strong> ${customerData.customerPhone}</p>
            <p><strong>Guests:</strong> ${customerData.guests}</p>
            <p><strong>Table:</strong> ${customerData.table?.tableNo || 'N/A'}</p>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${cartData.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>$${Math.round(total)}</span>
            </div>
            <div class="total-row">
              <span>Tax (5.25%):</span>
              <span>$${Math.round(tax)}</span>
            </div>
            <div class="total-row grand-total">
              <span><strong>TOTAL:</strong></span>
              <span><strong>$${Math.round(totalPriceWithTax)}</strong></span>
            </div>
            <div class="total-row">
              <span>Payment Method:</span>
              <span><strong>${paymentMethod || 'Not selected'}</strong></span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Have a great day! 🙏</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };








  return (
    <>
      <div className="h-full overflow-y-auto">
        {/* Bill Details */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 mt-2">
          <p className="text-xs sm:text-sm text-[#ababab] font-medium mt-2">
            Items ({cartData.length})
          </p>
          <h1 className="text-[#f5f5f5] text-sm sm:text-base font-bold">
            ${Math.round(total)}
          </h1>
        </div>

        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 mt-2">
          <p className="text-xs sm:text-sm text-[#ababab] font-medium mt-2">
            Tax (5.25%)
          </p>
          <h1 className="text-[#f5f5f5] text-sm sm:text-base font-bold">
            ${Math.round(tax)}
          </h1>
        </div>

        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 mt-2">
          <p className="text-xs sm:text-sm text-[#ababab] font-medium mt-2">
            Total with Tax
          </p>
          <h1 className="text-[#f5f5f5] text-sm sm:text-base font-bold">
            ${Math.round(totalPriceWithTax)}
          </h1>
        </div>

        {/* Payment Method Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 mt-4">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`bg-[#1f1f1f] px-4 py-2.5 sm:py-3 w-full rounded-lg text-[#ababab] font-semibold text-sm sm:text-base ${paymentMethod === "Cash" ? "bg-[#383737]" : ""
              }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("Online")}
            className={`bg-[#1f1f1f] px-4 py-2.5 sm:py-3 w-full rounded-lg text-[#ababab] font-semibold text-sm sm:text-base ${paymentMethod === "Online" ? "bg-[#383737]" : ""
              }`}
          >
            Online
          </button>
        </div>

        {/* Action Buttons */}
        <div
          onClick={handlePrintReceipt}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 mt-4 mb-4">
          <button className="bg-[#025cca] px-4 py-2.5 sm:py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-sm sm:text-base">
            Print Receipt
          </button>
          <button
            onClick={handlePlaceOrder}
            className="bg-[#f6b100] px-4 py-2.5 sm:py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-sm sm:text-base"
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  )
}

export default Bill











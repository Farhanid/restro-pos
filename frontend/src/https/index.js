import axios from 'axios'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});


//Api endpoints
export const login = (data) => api.post("api/user/login", data)
export const register = (data) => api.post("api/user/register", data)
export const getUserData = () => api.get("api/user")
export const logout = () => api.post("/api/user/logout")



//Table endpoints
export const addTable = (data) => api.post("api/table", data)
export const getTables = () => api.get("/api/table")
export const updateTable = ({ tableId, ...tableData }) => api.put(`/api/table/${tableId}`, tableData);


//Payment endpoints
export const createOrderRazorPay = (data) => api.post("/api/payment/create-order", data)
export const verifyPaymentRazorPay = (data) => api.post("/api/payment/verify-payment", data)

//Order EndPoints
export const addOrder = (data) => api.post("/api/order/", data);
export const getOrders = () => api.get("/api/order")

export const updateOrder = (id, data) => api.put(`/api/order/${id}`, data);


export const deleteOrder = (id) => api.delete(`/api/order/${id}`);




// History Endpoints
export const getHistory = (params) => api.get("/api/history", { params });
export const getHistoryStats = () => api.get("/api/history/stats");
export const getHistoryByOrderId = (orderId) => api.get(`/api/history/order/${orderId}`);
export const getHistoryByTable = (tableId, params) => api.get(`/api/history/table/${tableId}`, { params });
export const getHistoryByCustomerPhone = (phone, params) => api.get(`/api/history/customer/${phone}`, { params });
export const getDailySalesReport = (date) => api.get("/api/history/daily-sales", { params: { date } });






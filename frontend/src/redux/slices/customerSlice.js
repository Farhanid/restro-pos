import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null
}

const generateOrderId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomerName: (state, action) => {
            const { name, phone, guests } = action.payload;

            // ✅ Only generate orderId if this is a NEW order (not updating existing)
            if (!state.orderId) {
                state.orderId = generateOrderId();
            }

            state.customerName = name;
            state.customerPhone = phone;
            state.guests = guests;
        },

        // ✅ New action to reset for a new order
        startNewOrder: (state) => {
            state.orderId = generateOrderId();
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.tableNo = "";
        },

        updateCustomer: (state, action) => {
            const { name, phone, guest } = action.payload;
            if (name !== undefined) state.customerName = name;
            if (phone !== undefined) state.customerPhone = phone;
            if (guest !== undefined) state.guests = guest;
            // ✅ Preserves existing orderId
        },

        removeCustomer: (state) => {
            state.orderId = "";  // ✅ Clear orderId
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
        },

        updateTable: (state, action) => {
            state.table = action.payload.table;
        }
    }
})

export const {
    setCustomerName,
    removeCustomer,
    updateTable,
    startNewOrder,      // ✅ Export new action
    updateCustomer      // ✅ Export update action
} = customerSlice.actions;

export default customerSlice.reducer;
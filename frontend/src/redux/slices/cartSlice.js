import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItems: (state, action) => {
            // ✅ Check if item already exists
            const existingItem = state.find(item => item.name === action.payload.name);

            if (existingItem) {
                // Update existing item
                existingItem.quantity += action.payload.quantity;
                existingItem.price = existingItem.quantity * existingItem.pricePerQuantity;
            } else {
                // Add new item
                state.push(action.payload);
            }
        },

        removeItem: (state, action) => {
            // ✅ Fixed: Use !== instead of !=
            return state.filter(item => item.id !== action.payload);
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                item.price = item.quantity * item.pricePerQuantity;
            }
        },

        addNoteToItem: (state, action) => {
            const { id, note } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.note = note;
            }
        },

        removeAllItems: (state) => {
            return []
        }

    }
});



export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + item.price, 0)

export const {
    addItems,
    removeItem,
    updateQuantity,
    addNoteToItem,
    removeAllItems
} = cartSlice.actions;

export default cartSlice.reducer;
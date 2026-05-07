import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

export const fetchTransactions = createAsyncThunk(
    "/transactions/fetchAll",
    async(_, {rejectWithValue}) => {
        try {
            const response = await api.get("/transactions");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch transactions");
        }
    }
);

export const createTransaction = createAsyncThunk(
    "/transactions/create",
    async(data, {rejectWithValue}) => {
        try {
            const response = await api.post("/transactions", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create transaction");
        }
    }
);

export const updateTransaction = createAsyncThunk(
    "/transactions/update",
    async({id, data}, {rejectWithValue}) => {
        try {
            const response = await api.put(`/transactions/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update transaction");
        }
    }  
);

export const deleteTransaction = createAsyncThunk(
    "/transactions/delete",
    async(id, {rejectWithValue}) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete transaction");
        }
    }
);

const initialState = {
    transactions: [],     // list of all transactions
    currentTransaction: null,  // single transaction when viewing by id
    isLoading: false,
    error: null,
}

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            // fetch All 
            .addCase(fetchTransactions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload.data;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            })

            // Create
            .addCase(createTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions.push(action.payload.data);
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            })

            // Update
            .addCase(updateTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.transactions.findIndex(t => t.id === action.payload.data.id);
                if(index !== -1) state.transactions[index] = action.payload.data;
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            })
            
            // Delete
            .addCase(deleteTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = state.transactions.filter(t => t.id !== action.payload.data.id);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            })
    }
});

export default transactionSlice.reducer;
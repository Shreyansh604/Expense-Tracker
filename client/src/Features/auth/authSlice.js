import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async(data, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/login", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Login failed");
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async(data, {rejectWithValue}) => {
        try {
            const response = await api.post("/auth/register", data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
);

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            localStorage.removeItem("accessToken");
        },
    },

    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data.user;
                state.accessToken = action.payload.data.accessToken;

                localStorage.setItem("accessToken", action.payload.data.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            })
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.data || "Something went wrong";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
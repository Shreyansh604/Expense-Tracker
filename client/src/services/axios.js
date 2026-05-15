import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  withCredentials: true
});

// attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  // console.log("token being sent:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // token expired - clear storage and redirect to login
      localStorage.removeItem("accessToken");
      window.location.href = "/login?reason=expired";
    }
    return Promise.reject(error);
  }
);

export default api;
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authSlice.js";
import { Eye, EyeClosed } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const params = new URLSearchParams(window.location.search);
  const reason = params.get("reason");

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-lg py-10 px-8">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#f89f1b]">
            expense<span className="text-[#1a1a2e]">tracker</span>
          </span>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {reason === "expired" && (
          <p className="text-amber-400 text-sm mb-4">
            Your session has expired. Please log in again.
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#f89f1b] hover:border-gray-400 transition-colors"
          />
          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#f89f1b] hover:border-gray-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
            </button>
          </div>
          <div className="text-right">
            <a href="#" className="text-xs text-[#f89f1b]">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#f89f1b] text-white rounded-md text-sm font-semibold"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-[#f89f1b] font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

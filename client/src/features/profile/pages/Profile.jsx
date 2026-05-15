import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../services/axios.js";
import { logout, updateUser } from "../../auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log("user:", user);
  const { transactions } = useSelector((state) => state.transactions);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileError(null);
    setProfileSuccess(false);

    try {
      await api.put("/auth/update-profile", profileData);
      dispatch(updateUser(profileData));
    } catch (error) {
      setProfileError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This action is irreversible.")) {
      try {
        await api.delete("/auth/delete-account");
        dispatch(logout());
        navigate("/login");
      } catch (error) {
        setProfileError(
          error.response?.data?.message || "Something went wrong",
        );
      }
    }
  };

  // summary stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="min-h-screen bg-[#111118] p-6 w-full">
      <div className="max-w-[700px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-neutral-100">Profile</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your account information
          </p>
        </div>

        {/* Avatar + info */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-6 mb-4">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-700/50">
            <div className="w-16 h-16 rounded-full bg-[#f89f1b33] flex items-center justify-center text-2xl font-medium text-[#f89f1b] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-base font-medium text-neutral-100">
                {user?.name}
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-neutral-600 mt-1">
                Member since{" "}
                {new Date(user?.created_at).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Personal info form */}
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">
            Personal information
          </p>
          {profileError && (
            <p className="text-red-400 text-xs mb-3">{profileError}</p>
          )}
          {profileSuccess && (
            <p className="text-green-400 text-xs mb-3">
              Profile updated successfully
            </p>
          )}
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
                />
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="px-4 py-2 bg-[#f89f1b] rounded-lg text-sm font-medium text-neutral-900"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-6 mb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">
            Change password
          </p>
          {passwordError && (
            <p className="text-red-400 text-xs mb-3">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-400 text-xs mb-3">
              Password updated successfully
            </p>
          )}
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                Current password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                Confirm new password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 focus:outline-none focus:border-[#f89f1b]"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#f89f1b] rounded-lg text-sm font-medium text-neutral-900"
              >
                Update password
              </button>
            </div>
          </form>
        </div>

        {/* Account summary */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 p-6 mb-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">
            Account summary
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-900 rounded-xl border border-neutral-700/50 p-4 text-center">
              <p className="text-xl font-medium text-neutral-100">
                {transactions?.length || 0}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Total transactions
              </p>
            </div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-700/50 p-4 text-center">
              <p className="text-xl font-medium text-green-400">
                ₹{totalIncome?.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Total income</p>
            </div>
            <div className="bg-neutral-900 rounded-xl border border-neutral-700/50 p-4 text-center">
              <p className="text-xl font-medium text-red-400">
                ₹{totalExpense?.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Total expenses</p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-neutral-800 rounded-xl border border-red-400/20 p-6">
          <p className="text-sm font-medium text-red-400 mb-1">Danger zone</p>
          <p className="text-xs text-neutral-500 mb-4">
            These actions are irreversible. Please be careful.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-transparent border border-red-400/50 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

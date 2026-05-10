import { useState } from "react";
import {
  House,
  ArrowLeftRight,
  Tag,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react";
import SidebarItem from "./SidebarItems.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const SideBar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 flex flex-col bg-neutral-900 h-screen z-50 border-r border-neutral-800 transition-all duration-100 ${isOpen ? "w-60" : "w-12"}`}
    >
      {/* Header */}
      <div
        className={`h-14 flex items-center px-2 ${isOpen ? "justify-between" : "justify-center"}`}
      >
        {isOpen && (
          <span className="text-sm font-semibold pl-2">
            <span className="text-[#f89f1b]">expense</span>
            <span className="text-white">tracker</span>
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-8 flex items-center justify-center rounded-md hover:bg-neutral-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#e3e3e3"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 mt-2">
        <SidebarItem
          icon={House}
          label="Dashboard"
          to="/dashboard"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={ArrowLeftRight}
          label="Transactions"
          to="/transactions"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={Tag}
          label="Categories"
          to="/categories"
          isOpen={isOpen}
        />
        {/* <SidebarItem icon={Settings} label="Settings" to="/settings" isOpen={isOpen} /> */}
      </nav>

      {/* User section at bottom */}
      <div className="mt-auto border-t border-neutral-800 pt-2 pb-2 relative">
        {/* Dropdown menu — appears above */}
        {showUserMenu && (
          <div
            className={`absolute bottom-full mb-1 bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-lg ${isOpen ? "w-[calc(100%-16px)] left-2" : "w-40 left-0"}`}
          >
            <button
              onClick={() => {
                navigate("/settings");
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              <Settings size={15} />
              Settings
            </button>
            <div className="border-t border-neutral-700" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-neutral-700 transition-colors"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}

        {/* User button */}
        <div
          className={`flex items-center gap-2 p-2 mx-2 rounded-lg w-[calc(100%-16px)] hover:bg-neutral-800 transition-colors ${!isOpen && "justify-center"}`}
        >
          {/* Avatar + name — navigates to profile */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-[#f89f1b33] flex items-center justify-center text-xs font-medium text-[#f89f1b] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium text-neutral-300 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </button>

          {/* Arrow — toggles dropdown */}
          {isOpen && (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 rounded hover:bg-neutral-700 transition-colors flex-shrink-0"
            >
              <ChevronUp
                size={14}
                className={`text-neutral-500 transition-transform ${showUserMenu ? "" : "rotate-180"}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

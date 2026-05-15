import { useState } from "react";
import { House, ArrowLeftRight, Tag, Settings, LogOut, ChevronUp } from "lucide-react";
import SidebarItem from "./SidebarItems.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 flex flex-col bg-neutral-900 h-screen z-50 border-r border-neutral-800 w-60">

      {/* Header */}
      <div className="h-14 flex items-center px-4">
        <span className="text-sm font-semibold">
          <span className="text-[#f89f1b]">expense</span>
          <span className="text-white">tracker</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 mt-2">
        <SidebarItem icon={House} label="Dashboard" to="/dashboard" />
        <SidebarItem icon={ArrowLeftRight} label="Transactions" to="/transactions" />
        <SidebarItem icon={Tag} label="Categories" to="/categories" />
      </nav>

      {/* User section at bottom */}
      <div className="mt-auto border-t border-neutral-800 pt-2 pb-2 relative">

        {/* Dropdown */}
        {showUserMenu && (
          <div className="absolute bottom-full mb-1 left-2 w-[calc(100%-16px)] bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-lg">
            <button onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors">
              <Settings size={15} />
              Settings
            </button>
            <div className="border-t border-neutral-700" />
            <button onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-neutral-700 transition-colors">
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}

        {/* User button */}
        <div className="flex items-center gap-2 p-2 mx-2 rounded-lg w-[calc(100%-16px)] hover:bg-neutral-800 transition-colors">
          <button onClick={() => navigate("/profile")}
            className="flex items-center gap-2 flex-1 min-w-0 text-left">
            <div className="w-7 h-7 rounded-full bg-[#f89f1b33] flex items-center justify-center text-xs font-medium text-[#f89f1b] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium text-neutral-300 truncate">{user?.name}</p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>
          </button>

          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-1 rounded hover:bg-neutral-700 transition-colors flex-shrink-0">
            <ChevronUp size={14}
              className={`text-neutral-500 transition-transform ${showUserMenu ? "" : "rotate-180"}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
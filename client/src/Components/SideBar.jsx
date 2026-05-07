import { useState } from "react";
import { House, CreditCard, Feather } from "lucide-react";
import SidebarItem from "./SidebarItems";

const SideBar = ({ isOpen, setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 flex flex-col bg-neutral-900 h-screen z-50 border-r border-neutral-800 transition-all duration-100 ${
        isOpen ? "w-60" : "w-12"
      }`}
    >
      {/* Header / Toggle */}
      <div
        className={`h-14 flex items-center px-2 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen && <span className="text-white font-semibold pl-2">Logo</span>}
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

      {/* Nav items */}
      <nav className="flex flex-col gap-1 mt-2">
        <SidebarItem
          icon={House}
          label="Dashboard"
          to="/dashboard"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={CreditCard}
          label="Expenses"
          to="/expenses"
          isOpen={isOpen}
        />
      </nav>

      {/* Profile at bottom */}
      <div className="mt-auto border-t border-neutral-800 pt-2 pb-2">
        <SidebarItem
          icon={Feather}
          label="Profile"
          to="/profile"
          isOpen={isOpen}
        />
      </div>
    </div>
  );
};

export default SideBar;

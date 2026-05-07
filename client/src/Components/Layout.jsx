import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#1d1d1d]">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`flex-1 min-h-screen text-white transition-all duration-300 ${
          isOpen ? "ml-60" : "ml-12"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
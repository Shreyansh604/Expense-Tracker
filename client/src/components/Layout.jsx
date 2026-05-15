import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#111118]">
      <SideBar />
      <div className="flex-1 min-h-screen text-white ml-60">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
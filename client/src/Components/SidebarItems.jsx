import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to }) => {
  return (
    <NavLink to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 mx-2 rounded-lg transition-colors ${
          isActive ? "bg-neutral-700 text-white" : "text-gray-400 hover:bg-neutral-600 hover:text-white"
        }`
      }>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
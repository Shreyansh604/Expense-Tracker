import { NavLink } from "react-router-dom";
 
const SidebarItem = ({ icon: Icon, label, to, isOpen }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 p-2 mx-2 rounded-lg transition-colors ${
          isActive
            ? "bg-neutral-700 text-white"
            : "text-gray-400 hover:bg-neutral-600 hover:text-white"
        } ${isOpen ? "w-55" : "w-8 justify-center"}`
      }
    >
      <Icon size={18} className="shrink-0" />
      {isOpen && <span className="text-sm">{label}</span>}
    </NavLink>
  );
};
 
export default SidebarItem;
 
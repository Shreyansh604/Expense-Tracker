import { useState } from "react";
import { House, CreditCard, Feather } from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col top-0 left-0 bg-neutral-900 h-screen z-50 border border-r-neutral-800">
      {/* Sidebar */}
      <div
        className={`h-14 w-16 transition-all duration-100 flex justify-between items-center p-2 ${
          isOpen ? "w-60" : "w-12 justify-center"
        }`}
      >
        {isOpen && <span className="text-white">logo</span>}

          <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-8 flex items-center justify-center border-0 rounded-md hover:bg-neutral-500">
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

      <div
        className={`text-white p-2 mx-2 rounded-lg flex hover:bg-neutral-500 ${isOpen ? "w-60" : "w-12 justify-center"}`}
      >
        <House size={18} className="mt-1"/>
        {isOpen && <span className="ml-2">Home</span>}
      </div>

      <div
        className={`text-white p-2 mx-2 rounded-lg flex hover:bg-neutral-500 ${isOpen ? "w-60" : "w-12 justify-center"}`}
      >
        <CreditCard size={18} className="mt-1"/>
        {isOpen && <span className="ml-2">Expenses</span>}
      </div>

      <div className="mt-auto text-white pt-2 border-t-2 border-neutral-800">
        <div className={`text-white h-10 p-2 mx-2 mb-2 rounded-lg flex hover:bg-neutral-500 ${isOpen ? "w-60" : "w-12 justify-center"}`}>
          <Feather size={18} className="mt-1"/>
          {isOpen && <span className="pl-4">Username</span>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

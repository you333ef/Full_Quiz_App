
import {
  FaEnvelope,
  FaBell,
  FaPlus,
} from "react-icons/fa";
import UserDropdown from "./userDropdown";
import { FiMenu } from "react-icons/fi";

export default function Navbar({ open,setOpen ,menuItems}:{menuItems:any,open:boolean ,setOpen: any}) {
  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-6 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3 md:gap-4">
        {!open? 
         <button className="cursor-pointer md:hidden" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>

        :null}  
      
      </div>

      {/* Center button */}
     

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative">
          <FaEnvelope className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2 bg-rose-100 text-black text-[10px] px-1.5 rounded-full font-semibold">
            10
          </span>
        </div>
        <div className="relative">
          <FaBell className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2 bg-rose-100 text-black text-[10px] px-1.5 rounded-full font-semibold">
            10
          </span>
        </div>
        <div className="flex items-center gap-1">
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}

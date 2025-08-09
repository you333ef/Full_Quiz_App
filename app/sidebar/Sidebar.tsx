'use client'

import { MenuItem } from "../AuthLayout/learner/layout";
import { useRouter } from "next/navigation";
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: MenuItem[];
  setMenu: (menu: MenuItem[]) => void;
}
interface SidebarContentProps  {
  router: ReturnType<typeof useRouter>;
  setMenu: (menu: MenuItem[]) => void;
  menuItems: MenuItem[];

};


export default function Sidebar({ setMenu,open, setOpen,menuItems }: SidebarProps) {
 const router = useRouter()
  return (
    <>
      {/* Overlay for small screens */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block
        `}
      >
        <SidebarContent router={router} setMenu={setMenu} menuItems={menuItems}/>
      </aside>
    </>
  )
}

function SidebarContent({router,setMenu,menuItems}:SidebarContentProps) {
 
  const taps =(item:MenuItem)=>{
    const newMenu = menuItems.map(ele=>{
      return {name : ele.name ,icon:ele.icon,active: item.name=== ele.name,path:ele.path}
    })
    setMenu(newMenu);
    
    
  }
  return (
    <div className="w-64 bg-white h-screen px-0 pt-4 ">
      {menuItems.map((item, index) => (
        <div
        onClick={()=>{taps(item);router.push(item.path)}}
          key={index}
          className={`flex items-center gap-3 px-7 py-4 not-first:border-t-stone-800 not-first:border-t cursor-pointer 
            ${item.active ? 'bg-[#0A0F2F] text-white' : 'hover:bg-gray-100'}
          `}
        >
          <div className={`bg-[#FCEFE5] p-2 rounded-lg text-lg ${item.active ?'text-black' :''}`}>
            {item.icon}
          </div>
          <span className="font-semibold">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

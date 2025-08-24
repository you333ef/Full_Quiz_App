'use client'

import { useRouter } from "next/navigation"
import { MenuItem } from "../Instractot/layout"  // أو صحح الباث حسب مكان الملف

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

interface SidebarContentProps {
  router: ReturnType<typeof useRouter>;
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  menuItems: MenuItem[];
}

export default function Sidebar({ setMenu, open, setOpen, menuItems }: SidebarProps) {
  const router = useRouter()
  return (
    <>
      {/* overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block
        `}
      >
        <SidebarContent 
          router={router} 
          setMenu={setMenu} 
          menuItems={menuItems}
        />
      </aside>
    </>
  )
}

function SidebarContent({ router, setMenu, menuItems }: SidebarContentProps) {
  const handleClick = (item: MenuItem) => {
    router.push(item.path)   // الأول التنقل
    setMenu(prev => prev.map(ele => ({
      ...ele,
      active: item.name === ele.name
    })))
  }

  return (
    <div className="w-64 bg-white h-screen px-0 pt-4 ">
      {menuItems.map((item, index) => (
        <div
          onClick={() => handleClick(item)}
          key={index}
          className={`flex items-center gap-3 px-7 py-4 not-first:border-t-stone-800 not-first:border-t cursor-pointer 
            ${item.active ? 'bg-[#0A0F2F] text-white' : 'hover:bg-gray-100'}
          `}
        >
          <div className={`bg-[#0d0b09] text-white p-2 rounded-lg text-lg ${item.active ? 'text-white' : ''}`}>
            {item.icon}
          </div>
          <span className="font-semibold">{item.name}</span>
        </div>
      ))}
    </div>
  )
}

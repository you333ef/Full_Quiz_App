'use client'
import { ReactNode, useState } from 'react';
import {
  FaHome,
  FaChartBar,
  FaChalkboardTeacher,
} from 'react-icons/fa'
import Sidebar from '../../sidebar/Sidebar';
import Navbar from '../../navbar/navbar';
export interface MenuItem {
  name: string;
  icon: ReactNode;
  active?: boolean;
  path:string
};
const menuItems:MenuItem[] = [
  { name: 'Dashboard', icon: <FaHome /> ,active:true ,path:'/learner/dashboard'},
  { name: 'Quizzes', icon: <FaChalkboardTeacher />,path:'/learner/quizzes' },
  { name: 'Results', icon: <FaChartBar /> ,path:'/learner/results'},
]
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const [open, setOpen] = useState(false);
  const [menu , setMenu] = useState(menuItems)

  return (
    <html>
      <body>
        
        <Navbar open={open} setOpen={setOpen} menuItems={menu}/>
        <div className="flex gap-2">
       
        {/* Sidebar (always visible on md+, controlled by open on mobile) */}
          <Sidebar setMenu={setMenu} open={open} setOpen={setOpen} menuItems={menu} />
          {/* Main Content */}
           <main className="p-4">{children}</main>
        </div>


      </body>
    </html>
  );
}

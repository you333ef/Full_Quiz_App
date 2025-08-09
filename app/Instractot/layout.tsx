'use client'
import { ReactNode, useState } from 'react';
import {
  FaHome,
  FaUsers,
  FaQuestionCircle,
  FaChartBar,
  FaChalkboardTeacher,
} from 'react-icons/fa'
import { MdGroups } from 'react-icons/md'
import Sidebar from '../sidebar/Sidebar';
import Navbar from '../navbar/navbar';
interface menuItems{
  
    name:string
    icon:ReactNode;
    active?:boolean
 
}
const menuItems = [
  { name: 'Dashboard', icon: <FaHome /> ,path:'/Instractot/dashboard'},
  { name: 'Students', icon: <FaUsers />, path:'/Instractot/students' },
  { name: 'Groups', icon: <MdGroups />, path:'/Instractot/groups'},
  { name: 'Quizzes', icon: <FaChalkboardTeacher />, path:'/Instractot/quizzes' },
  { name: 'Results', icon: <FaChartBar />, path:'/Instractot/results' },
  { name: 'Help', icon: <FaQuestionCircle /> , path:'/Instractot/help'},
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
       
     
          <Sidebar setMenu={setMenu} open={open} setOpen={setOpen} menuItems={menu} />
        
           <main className="p-4 w-full">{children}</main>
        </div>


      </body>
    </html>
  );
}

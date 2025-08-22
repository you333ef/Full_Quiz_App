'use client'
import { ReactNode, useState } from 'react';
import { AddressBook } from 'tabler-icons-react';

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
import Protected_roote from '../Protected_roote';
interface menuItems{
  
    name:string
    icon:ReactNode;
    active?:boolean
 
}
const menuItems = [
  { name: 'Dashboard', icon: <FaHome /> ,path:'/learner/quizzes'},
 
 
  { name: 'Quizzes', icon: <FaChalkboardTeacher />, path:'/learner/quizzes' },
  { name: 'Results', icon: <FaChartBar />, path:'/learner/results' },
  
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
           <main className="p-4 w-full"><Protected_roote ROLE='Student' >{children}</Protected_roote></main>
        
          
        </div>


      </body>
    </html>
  );
}

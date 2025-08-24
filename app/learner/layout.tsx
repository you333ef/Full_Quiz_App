'use client'
import { ReactNode, useState } from 'react'
import { FaHome, FaChartBar, FaChalkboardTeacher,FaHandsHelping } from 'react-icons/fa'
import { GrContact } from "react-icons/gr";



import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/navbar'
import Protected_roote from '../Protected_roote'


export interface MenuItem {
  name: string
  icon: ReactNode
  active?: boolean
  path: string
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: <FaHome />, path: '/learner/quizzes' },
  { name: 'Quizzes', icon: <FaChalkboardTeacher />, path: '/learner/quizzes' },
  { name: 'Results', icon: <FaChartBar />, path: '/learner/results' },
    { name: 'Help', icon: <GrContact />, path: '/learner/help' },
]

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(menuItems)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar open={open} setOpen={setOpen} menuItems={menu} />
      <div className="flex flex-1 gap-2">
        <Sidebar setMenu={setMenu} open={open} setOpen={setOpen} menuItems={menu} />
        <main className="p-4 w-full">
          <Protected_roote ROLE="Student">{children}</Protected_roote>
        </main>
      </div>
    </div>
  )
}

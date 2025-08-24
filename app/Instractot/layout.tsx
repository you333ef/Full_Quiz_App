'use client'
import { ReactNode, useState } from 'react'
import { AddressBook } from 'tabler-icons-react'

import {
  FaHome,
  FaUsers,
  FaChartBar,
  FaChalkboardTeacher,
} from 'react-icons/fa'
import { MdGroups } from 'react-icons/md'

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
  { name: 'Dashboard', icon: <FaHome />, path: '/Instractot/dashboard' },
  { name: 'Students', icon: <FaUsers />, path: '/Instractot/students' },
  { name: 'Groups', icon: <MdGroups />, path: '/Instractot/groups' },
  { name: 'Quizzes', icon: <FaChalkboardTeacher />, path: '/Instractot/quizzes' },
  { name: 'Results', icon: <FaChartBar />, path: '/Instractot/results' },
  { name: 'Quetchans', icon: <AddressBook />, path: '/Instractot/Quetchans' },
]

export default function InstractotLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(menuItems)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar open={open} setOpen={setOpen} menuItems={menu} />
      <div className="flex flex-1 gap-2">
        <Sidebar 
          setMenu={setMenu} 
          open={open} 
          setOpen={setOpen} 
          menuItems={menu} 
        />
        <main className="p-4 w-full">
          <Protected_roote ROLE="Instructor">
            {children}
          </Protected_roote>
        </main>
      </div>
    </div>
  )
}

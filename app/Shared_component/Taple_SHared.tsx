'use client'
import React, { useEffect, useState } from 'react'
import { View, Edit, Delete, MoreHorizontal } from 'lucide-react'

interface TableSharedProps {
  rows: any[]
  T_Head: string[]
  funView?: (item: unknown) => void
  funEdit?: (item: unknown) => void
  funDelete?: (item: unknown) => void
}

const TableShared: React.FC<TableSharedProps> = ({ rows = [], T_Head, funView, funEdit, funDelete }) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index)
  }

  const closeDropdown = () => {
    setOpenDropdown(null)
  }
 

  const truncateColumns = ['max_students', '_id', 'instructor', 'students']

  return (
    <div className="w-full overflow-hidden">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {T_Head.map((header, index) => (
                  <th key={index} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 tracking-wide">
                    {header}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white border-t border-gray-200">
              {rows.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  {T_Head.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                        {truncateColumns.includes(column) 
                          ? String(item[column] || '').substring(0, 3) 
                          : item[column] || '—'}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                    {openDropdown === index && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                          <div className="py-1">
                            {typeof funView === 'function' && (
                              <button
                                onClick={() => {
                                  funView(item)
                                  closeDropdown()
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <View className="w-4 h-4" />
                                View
                              </button>
                            )}
                            {typeof funEdit === 'function' && (
                              <button
                                onClick={() => {
                                  funEdit(item)
                                  closeDropdown()
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            )}
                            {typeof funDelete === 'function' && (
                              <button
                                onClick={() => {
                                  funDelete(item)
                                    setTimeout(() => closeDropdown(), 100);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <Delete className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-4">
          {rows.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap pr-4">
                    {item.name || 'Unnamed'}
                  </h3>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => toggleDropdown(index + 1000)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                    {openDropdown === index + 1000 && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={closeDropdown} />
                        <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                          <div className="py-1">
                            {typeof funView === 'function' && (
                              <button
                                onClick={() => {
                                  funView(item)
                                  closeDropdown()
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <View className="w-4 h-4" />
                                View
                              </button>
                            )}
                            {typeof funEdit === 'function' && (
                              <button
                                onClick={() => {
                                  funEdit(item)
                                  closeDropdown()
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            )}
                            {typeof funDelete === 'function' && (
                              <button
                                onClick={() => {
                                  funDelete(item)
                                 setTimeout(() => closeDropdown(), 100);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-3"
                              >
                                <Delete className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {T_Head.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">{column}:</span>
                      <span className="text-sm text-gray-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                        {truncateColumns.includes(column) 
                          ? String(item[column] || '').substring(0, 3) 
                          : item[column] || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-sm">No data available</div>
        </div>
      )}
    </div>
  )
}

export default TableShared
"use client"
import React, { useState } from "react"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"

interface TableSharedProps {
  rows?: any[]
  T_Head?: string[]
  funView?: (item: unknown) => void
  funEdit?: (item: unknown) => void
  funDelete?: (item: unknown) => void
}

const demoRows = [
  { name: "OBJECT TWINT44", max_students: 25, status: "active", _id: "689", instructor: "688", students: "65c", group: "History", students_count: 3 },
  { name: "ITI Group", max_students: 25, status: "active", _id: "701", instructor: "688", students: "689", group: "English", students_count: 2 },
  { name: "Frontend Team", max_students: 30, status: "active", _id: "702", instructor: "705", students: "690", group: "UI/UX", students_count: 1 },
  { name: "OBJECT TWINT44", max_students: 25, status: "active", _id: "703", instructor: "688", students: "65c", group: "C", students_count: 1 },
  { name: "Mahmoud Hamed", max_students: 20, status: "active", _id: "704", instructor: "700", students: "65b", group: "History", students_count: 3 },
  { name: "Ahmed Mohamed", max_students: 22, status: "active", _id: "705", instructor: "701", students: "65a", group: "D", students_count: 2 },
]

const demoHead = ["name", "max_students", "status", "_id", "instructor", "students"]

const Taple_Two: React.FC<TableSharedProps> = ({
  rows = demoRows,
  T_Head = demoHead,
  funView,
  funEdit,
  funDelete,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const toggleDropdown = (index: number) => setOpenDropdown(openDropdown === index ? null : index)
  const closeDropdown = () => setOpenDropdown(null)

  const truncateColumns = ["max_students", "_id", "instructor", "students"]
  const initials = (s: string) => (s && s.trim().length > 0 ? s.trim()[0].toUpperCase() : "?")

  return (
    <div className="w-full overflow-hidden">
      {/* Desktop (بطاقات على الشاشات الكبيرة فقط) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[16px]">
          {rows.map((item, index) => (
            <div
              key={index}
              className="bg-[rgba(255,255,255,1)] rounded-[12px] border border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-[16px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-[rgba(59,130,246,0.15)] flex items-center justify-center text-[18px] font-semibold text-[rgba(17,24,39,1)]">
                    {initials(item.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] font-semibold leading-[24px] text-[rgba(17,24,39,1)] truncate max-w-[420px]">
                      {item.name || "Unnamed"}
                    </div>
                    <div className="mt-[6px] flex items-center gap-[12px] text-[14px] text-[rgba(55,65,81,0.9)]">
                      <div className="font-semibold">Group:</div>
                      <div className="font-medium">{item.group || "—"}</div>
                      <div className="text-[rgba(107,114,128,1)]">•</div>
                      <div className="font-medium">{item.students_count || 0}-Students</div>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center gap-[12px]">
                  {typeof funDelete === "function" && (
                    <button
                      aria-label="delete"
                      onClick={() => funDelete(item)}
                      className="w-[36px] h-[36px] rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,1)] hover:bg-[rgba(249,250,251,1)] flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-[18px] h-[18px] text-[rgba(31,41,55,0.9)]" />
                    </button>
                  )}

                  {typeof funView === "function" && (
                    <button
                      aria-label="view"
                      onClick={() => funView(item)}
                      className="w-[36px] h-[36px] rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,1)] hover:bg-[rgba(249,250,251,1)] flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-[18px] h-[18px] text-[rgba(31,41,55,0.9)]" />
                    </button>
                  )}

                  <button
                    aria-label="more"
                    onClick={() => toggleDropdown(index)}
                    className="w-[36px] h-[36px] rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,1)] hover:bg-[rgba(249,250,251,1)] flex items-center justify-center transition-colors"
                  >
                    <MoreHorizontal className="w-[18px] h-[18px] text-[rgba(107,114,128,1)]" />
                  </button>

                  {openDropdown === index && (
                    <>
                      <div className="fixed inset-0 z-[90]" onClick={closeDropdown} />
                      <div className="absolute right-0 top-[48px] w-[180px] bg-[rgba(255,255,255,1)] rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] overflow-hidden z-[100]">
                        <div className="py-[6px]">
                          {typeof funView === "function" && (
                            <button
                              onClick={() => {
                                funView(item)
                                closeDropdown()
                              }}
                              className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(17,24,39,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                            >
                              <Eye className="w-[16px] h-[16px]" />
                              View
                            </button>
                          )}
                          {typeof funEdit === "function" && (
                            <button
                              onClick={() => {
                                funEdit(item)
                                closeDropdown()
                              }}
                              className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(17,24,39,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                            >
                              <Edit className="w-[16px] h-[16px]" />
                              Edit
                            </button>
                          )}
                          {typeof funDelete === "function" && (
                            <button
                              onClick={() => {
                                funDelete(item)
                                setTimeout(() => closeDropdown(), 100)
                              }}
                              className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(220,38,38,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                            >
                              <Trash2 className="w-[16px] h-[16px]" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-[16px] grid grid-cols-3 gap-[12px]">
                {T_Head.map((column, colIndex) => (
                  <div key={colIndex} className="min-w-0">
                    <div className="text-[12px] text-[rgba(107,114,128,1)] mb-[6px] font-medium truncate">{column}</div>
                    <div className="text-[14px] text-[rgba(17,24,39,1)] font-semibold truncate">
                      {truncateColumns.includes(column)
                        ? String(item[column] || "").substring(0, 3)
                        : item[column] || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (نفس الشكل والمنطق الحالي) */}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-[16px]">
          {rows.map((item, index) => (
            <div key={index} className="bg-[rgba(255,255,255,1)] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-[16px]">
                <div className="flex justify-between items-start mb-[12px]">
                  <h3 className="text-[16px] font-semibold text-[rgba(17,24,39,1)] truncate pr-[8px]">
                    {item.name || "Unnamed"}
                  </h3>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => toggleDropdown(index + 1000)}
                      className="inline-flex items-center justify-center w-[32px] h-[32px] rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,1)] hover:bg-[rgba(249,250,251,1)] transition-colors"
                    >
                      <MoreHorizontal className="w-[16px] h-[16px] text-[rgba(107,114,128,1)]" />
                    </button>
                    {openDropdown === index + 1000 && (
                      <>
                        <div className="fixed inset-0 z-[90]" onClick={closeDropdown} />
                        <div className="absolute right-0 top-[40px] w-[180px] bg-[rgba(255,255,255,1)] rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.08)] z-[100] overflow-hidden">
                          <div className="py-[6px]">
                            {typeof funView === "function" && (
                              <button
                                onClick={() => {
                                  funView(item)
                                  closeDropdown()
                                }}
                                className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(17,24,39,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                              >
                                <Eye className="w-[16px] h-[16px]" />
                                View
                              </button>
                            )}
                            {typeof funEdit === "function" && (
                              <button
                                onClick={() => {
                                  funEdit(item)
                                  closeDropdown()
                                }}
                                className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(17,24,39,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                              >
                                <Edit className="w-[16px] h-[16px]" />
                                Edit
                              </button>
                            )}
                            {typeof funDelete === "function" && (
                              <button
                                onClick={() => {
                                  funDelete(item)
                                  setTimeout(() => closeDropdown(), 100)
                                }}
                                className="w-full px-[12px] py-[8px] text-left text-[14px] text-[rgba(220,38,38,1)] hover:bg-[rgba(249,250,251,1)] flex items-center gap-[10px]"
                              >
                                <Trash2 className="w-[16px] h-[16px]" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  {T_Head.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between">
                      <span className="text-[12px] font-medium text-[rgba(107,114,128,1)]">{column}:</span>
                      <span className="text-[14px] text-[rgba(17,24,39,1)] font-medium truncate max-w-[200px]">
                        {truncateColumns.includes(column)
                          ? String(item[column] || "").substring(0, 3)
                          : item[column] || "—"}
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
        <div className="text-center py-[48px]">
          <div className="text-[14px] text-[rgba(107,114,128,1)]">No data available</div>
        </div>
      )}
    </div>
  )
}

export default Taple_Two

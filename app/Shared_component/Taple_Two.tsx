"use client"
import React, { useState } from "react"
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"

interface TableSharedProps {
  rows?: any[]
  T_Head?: string[]
  funView?: (item: unknown) => void
  funEdit?: (item: unknown) => void
  funDelete?: (item: unknown) => void
  FunGetAll?: () => void
  data_Students?: any[]
}

const Taple_Two: React.FC<TableSharedProps> = ({
  rows,
  T_Head,
  funView,
  funEdit,
  funDelete,
  data_Students,
  FunGetAll,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  const toggleDropdown = (index: number) => setOpenDropdown(openDropdown === index ? null : index)
  const closeDropdown = () => setOpenDropdown(null)

  const students = data_Students ?? [] 
  const truncateColumns = ["max_students", "_id", "instructor", "students"]

  const initials = (first?: string, last?: string) => {
    const name = `${first ?? ""} ${last ?? ""}`.trim()
    return name ? name[0].toUpperCase() : "?"
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[16px]">
          {students.map((item, index) => (
            <div
              key={item._id ?? index}
              className="bg-[rgba(255,255,255,1)] rounded-[12px] border border-[rgba(0,0,0,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-[16px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[64px] h-[64px] rounded-full bg-[#eaeef2] flex items-center justify-center text-[18px] font-semibold text-[#000]">
                    {initials(item.first_name, item.last_name)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] font-semibold leading-[24px] text-[rgba(17,24,39,1)] truncate max-w-[420px]">
                      {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Unnamed"}
                    </div>
                    <div className="mt-[6px] flex items-center gap-[12px] text-[14px] text-[rgba(55,65,81,0.9)]">
                      <div className="font-semibold">Group:</div>
                      <div className="font-medium">{item.group?.name || "—"}</div>
                      <div className="text-[rgba(107,114,128,1)]">•</div>
                      <div className="font-medium">{item.group?.students?.length || 0}-Students</div>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center gap-[12px]">
                  {/* هنا خليت بس زرار الـ dropdown بره، وباقي الأيقونات جوه الـ dropdown */}
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
                                funView(item) // بمرر الـ item كامل، تقدر تغيّر لو عايز تمرر _id
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
            </div>
          ))}
        </div>
      </div>

      {/* Mobile*/}
      <div className="block lg:hidden">
        <div className="flex flex-col gap-[16px]">
          {students.map((item, index) => (
            <div key={item._id ?? index} className="bg-[rgba(255,255,255,1)] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[rgba(0,0,0,0.08)] overflow-hidden">
              <div className="p-[16px]">
                <div className="flex justify-between items-start mb-[12px]">
                  <h3 className="text-[16px] font-semibold text-[rgba(17,24,39,1)] truncate pr-[8px]">
                    {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Unnamed"}
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
                  <div className="flex justify-between">
                    <span className="text-[12px] font-medium text-[rgba(107,114,128,1)]">Name:</span>
                    <span className="text-[14px] text-[rgba(17,24,39,1)] font-medium truncate max-w-[200px]">
                      {`${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Unnamed"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[12px] font-medium text-[rgba(107,114,128,1)]">Status:</span>
                    <span className="text-[14px] text-[rgba(17,24,39,1)] font-medium truncate max-w-[200px]">
                      {item.status ?? "—"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[12px] font-medium text-[rgba(107,114,128,1)]">Team Size:</span>
                    <span className="text-[14px] text-[rgba(17,24,39,1)] font-medium truncate max-w-[200px]">
                      {item.group?.students?.length ?? 0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[12px] font-medium text-[rgba(107,114,128,1)]">Team:</span>
                    <span className="text-[14px] text-[rgba(17,24,39,1)] font-medium truncate max-w-[200px]">
                      {item.group?.name || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center py-[48px]">
          <div className="text-[14px] text-[rgba(107,114,128,1)]">No data available</div>
        </div>
      )}
    </div>
  )
}

export default Taple_Two

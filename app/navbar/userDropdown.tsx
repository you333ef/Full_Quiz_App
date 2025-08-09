"use client";

import avatar from "../../public/avatar.png";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-gray-100 rounded-md"
      >
        <Image src={avatar} alt="User Avatar"   className="w-8 h-8 rounded-full" />
        <span className="hidden sm:block text-sm font-medium">Hamza</span>
        <FaChevronDown size={12} />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white border border-gray-200 z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
}

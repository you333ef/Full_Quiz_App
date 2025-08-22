'use client';

import axios from 'axios';
import { useState, useEffect, useRef, useCallback, useContext, memo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../Store/Context';
import { CgProfile } from 'react-icons/cg';

// Memoized Dropdown Menu Component
const DropdownMenu = memo(({ onProfileClick, onChangePassword, onLogout }: {
  onProfileClick: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}) => (
  <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-[#ffffff] border border-[#e2e8f0] z-50">
    <ul className="py-1 text-sm text-[#4b5563]">
      <li className="px-4 py-2 hover:bg-[#f3f4f6] cursor-pointer" onClick={onProfileClick}>
        Profile
      </li>
      <li className="px-4 py-2 hover:bg-[#f3f4f6] cursor-pointer" onClick={onChangePassword}>
        Change Password
      </li>
      <li className="px-4 py-2 hover:bg-[#f3f4f6] cursor-pointer" onClick={onLogout}>
        Logout
      </li>
    </ul>
  </div>
));
DropdownMenu.displayName = 'DropdownMenu';

// Memoized Profile Modal Component
const ProfileModal = memo(({ firstName, role, email, onClose }: {
  firstName: string | undefined;
  role: string | undefined;
  email: string | undefined;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-[#ffffff] rounded-2xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
      <h2 className="text-xl font-bold mb-4 text-center text-[#1f2937]">Profile Info</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold text-[#1f2937]">First Name:</span> {firstName || 'N/A'}
        </p>
        <p>
          <span className="font-semibold text-[#1f2937]">Role:</span> {role || 'N/A'}
        </p>
        <p>
          <span className="font-semibold text-[#1f2937]">Email:</span> {email || 'N/A'}
        </p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 rounded-lg bg-[#000000] text-[#ffffff] hover:bg-[#1f2937]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
));
ProfileModal.displayName = 'ProfileModal';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data_User } = useContext(AuthContext);
  const router = useRouter();

  // Sync profile with localStorage only when data_User changes
  useEffect(() => {
    if (data_User) {
      try {
        localStorage.setItem('Profile', JSON.stringify(data_User));
        setProfile(data_User);
      } catch (error) {
        console.error('Failed to save profile to localStorage:', error);
        localStorage.removeItem('Profile');
      }
    } else {
      try {
        const stored = localStorage.getItem('Profile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Invalid JSON in localStorage:', error);
        localStorage.removeItem('Profile');
      }
    }
  }, [data_User]);

  // Optimized click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, { passive: true });
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Memoized navigation functions
  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('DataQuiz');
      router.push('/AuthLayout/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [router]);

  const handleChangePassword = useCallback(() => {
    router.push('/AuthLayout/changePass');
  }, [router]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer px-2 py-1 hover:bg-[#f3f4f6] rounded-md"
      >
        <CgProfile className="text-[#000000] text-[27px]" />
        <div className="flex flex-col items-start">
          <span className="hidden sm:block text-sm font-semibold text-[#1f2937]">
            {profile?.first_name || 'User'}
          </span>
          <small className="hidden sm:block font-medium text-xs text-[#6b7280]">
            {profile?.role || 'N/A'}
          </small>
        </div>
        <FaChevronDown size={15} className="text-[#1f2937]" />
      </div>

      {open && (
        <DropdownMenu
          onProfileClick={() => setShowModal(true)}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
        />
      )}

      {showModal && (
        <ProfileModal
          firstName={profile?.first_name}
          role={profile?.role}
          email={profile?.email}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default memo(UserDropdown);
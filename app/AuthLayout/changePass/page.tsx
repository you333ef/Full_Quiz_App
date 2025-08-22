'use client';

import InputShared from '../../Shared_component/InputSHared';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  password: string;
  password_new: string;
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://upskilling-egypt.com:3005/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success('Password changed successfully');
        setTimeout(() => {
          router.push('/AuthLayout/login');
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      <h2 className="text-xl font-semibold text-lime-300 mb-2 text-center lg:text-left">
        Update your password
      </h2>
      <p className="text-sm text-gray-300 mb-4 text-center lg:text-left">
        For your security, please provide your current and new password.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md w-full space-y-4">
        {/* Current Password */}
        <InputShared
          register={register}
          name="password"
          type="password"
          validation={{ required: 'The current password is required' }}
          iconInput={<RiLockPasswordLine className="text-gray-500" />}
          label="Current password"
          placeholder="Type your current password"
        />
        {errors.password && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.password.message}
          </p>
        )}

        {/* New Password */}
        <InputShared
          register={register}
          name="password_new"
          type="password"
          validation={{ required: 'The new password is required' }}
          iconInput={<RiLockPasswordLine className="text-gray-500" />}
          label="New password"
          placeholder="Type your new password"
        />
        {errors.password_new && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.password_new.message}
          </p>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          {/* Large screens: button aligned right */}
          <div className="hidden lg:flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Small/Medium screens: button full-width & centered */}
          <div className="lg:hidden flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;

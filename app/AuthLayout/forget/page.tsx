'use client';

import InputShared from '../../Shared_component/InputSHared';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  email: string;
}

const ForgetPasswordPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://upskilling-egypt.com:3005/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (response.ok) {
        toast.success('Reset link sent successfully');
        reset();
        router.push('/AuthLayout/reset');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send reset link');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      {/* العنوان متوسّط على الموبايل */}
      <h2 className="text-xl font-semibold text-lime-300 mb-2 text-center lg:text-left">
        Forgot your password?
      </h2>
      <p className="text-sm text-gray-300 mb-4 text-center lg:text-left">
        Enter your email address to receive the reset link.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full space-y-4 forget-form"
      >
        {/* Email */}
        <InputShared
          register={register}
          name="email"
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          }}
          iconInput={<FiMail className="text-gray-500" />}
          label="Email address"
          placeholder="Type your email"
        />
        {errors.email && (
          <p className="text-red-500 ml-2 text-sm capitalize">
            {errors.email.message}
          </p>
        )}

        {/* Submit + Login link */}
       <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-between lg:items-center pt-2">
  {/* زرار Send */}
  <button
    type="submit"
    disabled={loading}
    className="w-full lg:w-auto bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-100 cursor-pointer"
  >
    {loading ? 'Sending...' : 'Send'}
  </button>

  {/* Back */}
  <div className="w-full lg:w-auto text-center lg:text-right">
    <Link
      href="/AuthLayout/login"
      className="block w-full lg:w-auto bg-lime-300 text-black lg:bg-transparent lg:text-lime-300 px-4 py-2 rounded-md font-semibold hover:underline text-sm"
    >
      Back to login
    </Link>
  </div>
</div>

      </form>

      {/* Scoped styles */}
      <style jsx>{`
        .forget-form input,
        .forget-form textarea,
        .forget-form select {
          width: 100% !important;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default ForgetPasswordPage;

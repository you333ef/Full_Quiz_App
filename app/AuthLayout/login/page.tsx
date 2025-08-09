'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import InputShared from '../../Shared_component/InputSHared';
import AuthTabs from '../../AuthTabs/AuthTabs';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useRouter();
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const response = await fetch('https://upskilling-egypt.com:3005/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.data.accessToken);
        toast.success('Login successful');
        reset();
        navigate.push('/Instractot');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-white">
      
      <h2 className="text-xl font-semibold text-lime-300">
        Continue your learning journey with <span className="text-white">QuizWiz!</span>
      </h2>

      <AuthTabs active="signin" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <InputShared
          name="email"
          register={register}
          label="Registered email address"
          placeholder="Type your email"
          type="email"
          iconInput={<FaEnvelope className="text-gray-500" />}
          validation={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address',
            },
          }}
        />

        <InputShared
          name="password"
          register={register}
          label="Password"
          placeholder="Type your password"
          type="password"
          iconInput={<FaLock className="text-gray-500" />}
          validation={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
        />

        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            title="Sign In"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'} <FaCheckCircle />
          </button>

          <p className="text-sm">
            Forgot password?{' '}
            <Link href="/AuthLayout/forget" className="text-lime-300 hover:underline">
              click here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
'use client';

import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import InputShared from '../../Shared_component/InputSHared';
import AuthTabs from '../../AuthTabs/AuthTabs';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/app/Store/Context';

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useRouter();
  const pathname = usePathname();
  const { register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);

  // handle null-safety for AuthContext
  const auth = useContext(AuthContext);
  const data_User = auth?.data_User;
  const setData_User = auth?.setData_User;

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
        localStorage.setItem('role', result.data.profile.role);

        // safe call
        setData_User && setData_User(result.data.profile);

        toast.success('Login successful');
        reset();
        if (result.data.profile.role === 'Student') {
          navigate.push('/learner/quizzes');
        } else if (result.data.profile.role === 'Instructor') {
          navigate.push('/Instractot/dashboard');
        } else {
          navigate.push('/');
        }
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
      {/* header */}
      <h2 className="text-xl font-semibold text-lime-300 whitespace-normal text-center lg:text-left">
        Continue your learning journey with <span className="text-white">QuizWiz!</span>
      </h2>

      {/* Desktop tabs */}
      <div className="hidden lg:block mt-4">
        <AuthTabs active="signin" />
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden mt-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/AuthLayout/register"
            className="w-full text-center py-2 rounded-md font-semibold transition-all !bg-lime-300 text-white border border-white/20"
          >
            Sign In
          </Link>
          <Link
            href="/AuthLayout/signup"
            className="w-full text-center py-2 rounded-md font-semibold transition-all bg-transparent text-white border border-white/20"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=" login-form w-full">
        <div className="w-full">
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
        </div>

        <div className="w-full">
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
        </div>

        {/* Submit + Forgot */}
        <div className="mt-6 flex flex-col items-center gap-3 lg:flex-row lg:justify-between lg:items-center">
          <button
            type="submit"
            title="Sign In"
            className="submit-btn w-full lg:w-auto flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'} <FaCheckCircle />
          </button>

          <div className="w-full lg:w-auto text-center lg:text-right">
            <p className="text-sm mt-1">
              Forgot password?{' '}
              <Link href="/AuthLayout/forget" className="text-lime-300 hover:underline">
                click here
              </Link>
            </p>
          </div>
        </div>
      </form>

      <style jsx>{`
        .login-form input,
        .login-form textarea,
        .login-form select {
          width: 100% !important;
          box-sizing: border-box;
        }
        .login-form .icon-input-wrapper {
          width: 100%;
        }
        .submit-btn {
          display: inline-flex;
        }
        .lg\\:hidden a:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
}

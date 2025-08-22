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
  const { setData_User, data_User } = useContext(AuthContext);

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
        localStorage.setItem('role',result.data.profile.role)
        setData_User(result.data.profile);

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

  // determine active tab for mobile
 
  return (
    <div className="w-full text-white">
      {/* header: allow wrapping and center on small screens */}
      <h2 className="text-xl font-semibold text-lime-300 whitespace-normal text-center lg:text-left">
        Continue your learning journey with <span className="text-white">QuizWiz!</span>
      </h2>

      {/* --- Desktop / large: keep original AuthTabs visible on lg and up --- */}
      <div className="hidden lg:block mt-4">
        <AuthTabs active="signin"/>
      </div>

      {/* --- Mobile / small & medium: stacked full-width tabs --- */}
      <div className="lg:hidden mt-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          {/* Sign In - active shows text-lime-300 on white background; inactive shows white text on transparent bg */}
          <Link
            href="/AuthLayout/register"
           className="w-full text-center py-2 rounded-md font-semibold transition-all !bg-lime-300 text-white border border-white/20"

           
          >
            Sign In
          </Link>

          {/* Sign Up - mirror logic */}
          <Link
            href="/AuthLayout/signup"
            className={`w-full text-center py-2 rounded-md font-semibold transition-all bg-transparent text-white border border-white/20
              
              
            `}
          
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

        {/* Submit + Forgot area
            - mobile (default): stacked, submit full-width and centered, forgot under submit
            - lg and up: restore side-by-side style (submit left, forgot right)
        */}
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

      {/* Scoped styles to force inputs and icons to take full width on small/medium,
          and to keep everything self-contained in this file (no global vars). */}
      <style jsx>{`
        /* ensure any native inputs inside InputShared expand to container width */
        .login-form input,
        .login-form textarea,
        .login-form select {
          width: 100% !important;
          box-sizing: border-box;
        }

        /* ensure icon + input wrappers (if inline) wrap nicely on small screens */
        .login-form .icon-input-wrapper {
          width: 100%;
        }

        /* keep submit button centered visually */
        .submit-btn {
          display: inline-flex;
        }

        /* slight focus/active micro-interaction for mobile tabs */
        .lg\\:hidden a:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  );
}

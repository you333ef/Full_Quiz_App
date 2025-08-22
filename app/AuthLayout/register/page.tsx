'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaIdCard,
} from "react-icons/fa";
import InputShared from '../../Shared_component/InputSHared';
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import AuthTabs from "@/app/AuthTabs/AuthTabs";


type SignUpFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
};

export default function SignUpPage() {
  const { register, handleSubmit, reset } = useForm<SignUpFormInputs>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignUpFormInputs) => {
    setLoading(true);
    try {
      const response = await fetch('https://upskilling-egypt.com:3005/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (response.ok) {
        toast.success('Registration successful');
        reset();
        router.push('/AuthLayout/login');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Registration failed');
        console.error('Register error:', errorData);
      }
    } catch (err) {
      console.error('Network / Unexpected error:', err);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <h2 className="text-xl font-semibold text-lime-300 text-center lg:text-left">
        Create your account and start using{" "}
        <span className="text-white">QuizWiz!</span>
      </h2>

      {/* --- Large screens: use AuthTabs --- */}
      <div className="hidden lg:block mt-4">
        <AuthTabs active="signup" />
      </div>

      {/* --- Mobile / small & medium: stacked full-width tabs --- */}
      <div className="lg:hidden mt-4 w-full">
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/AuthLayout/login"
            className="w-full text-center py-2 rounded-md font-semibold transition-all bg-transparent text-white border border-white/20"
          >
            Sign In
          </Link>
          <Link
            href="/AuthLayout/signup"
            className="w-full text-center py-2 rounded-md font-semibold transition-all !bg-lime-300 text-white border border-white/20"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* --- Form --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 signup-form">
        {/* First & Last Name */}
        <div className="flex flex-col lg:flex-row gap-4">
          <InputShared
            name="firstName"
            register={register}
            label="Your first name"
            placeholder="Type your first name"
            type="text"
            iconInput={<FaIdCard className="text-gray-500" />}
            validation={{ required: "First name is required" }}
          />

          <InputShared
            name="lastName"
            register={register}
            label="Your last name"
            placeholder="Type your last name"
            type="text"
            iconInput={<FaIdCard className="text-gray-500" />}
            validation={{ required: "Last name is required" }}
          />
        </div>

        {/* Email */}
        <InputShared
          name="email"
          register={register}
          label="Your email address"
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

        {/* Role Select */}
        <div className="w-full p-2">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Your role
          </label>
          <select
            {...register("role", { required: "Role is required" })}
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue=""
          >
            <option value="" disabled>
              Choose your role
            </option>
            <option value="Instructor">Instructor</option>
            <option value="Student">Student</option>
          </select>
        </div>

        {/* Password */}
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

        {/* Submit */}
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-between lg:items-center mt-4">
          <button
            type="submit"
            className="w-full lg:w-auto flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"} <FaCheckCircle />
          </button>

          <p className="text-sm text-center lg:text-right">
            Already have an account?{" "}
            <Link
              href="/AuthLayout/login"
              className="text-lime-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>

      {/* Scoped styles */}
      <style jsx>{`
        .signup-form input,
        .signup-form textarea,
        .signup-form select {
          width: 100% !important;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}

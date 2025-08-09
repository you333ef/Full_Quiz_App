'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaIdCard,
} from "react-icons/fa";
import InputShared from '../../Shared_component/InputSHared';
import AuthTabs from "../../AuthTabs/AuthTabs";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

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
        const result = await response.json();
        toast.success('Registration successful');
        reset();
        // Use next/navigation router push
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
      {/* Toast container */}
      <ToastContainer />

      <h2 className="text-xl font-semibold text-lime-300">
        Create your account and start using{" "}
        <span className="text-white">QuizWiz!</span>
      </h2>

      <AuthTabs active="signup" />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign Up"} <FaCheckCircle />
          </button>

          <p className="text-sm">
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
    </>
  );
}

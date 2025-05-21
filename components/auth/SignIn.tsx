"use client"

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Link from 'next/link';

// Zod schema
const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid e-mail' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignIn() {

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({ email: '', password: '' });

  // Errors state for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter()
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev: Record<string, string>) => ({ ...prev, [e.target.name]: '' })); // clear error on change
  };

  // Handle form submit
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate formData using Zod manually
    const result = schema.safeParse(formData);

    if (!result.success) {
      // Build errors object from Zod errors

      const fieldErrors: Record<string, string> = {};

      result.error.errors.forEach((err: z.ZodIssue) => {
        const key = String(err.path[0]); // ensure it's a string
        fieldErrors[key] = err.message;
      });

      setErrors(fieldErrors);
      return; // don't proceed if validation failed
    }

    // Validation passed, submit form
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password });
      if (error) {
        toast(error.message);
      } else {
        toast("Signin successful");
        router.push('/');
      }

    } catch (err: unknown) {
      let msg = 'Something went wrong. Try again.';
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        msg = error.response?.data?.message || msg;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
      setFormData((prev) => ({ ...prev, password: '' })); // clear password field only
    }
  };

  // Animation variants
  const fadeSlide = {
    hidden: { opacity: 0, x: 0 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* ---------- left image ---------- */}
      <div className="relative hidden md:block h-screen bg-black">


        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Welcome to <span className="text-slate-400">Chloe</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl drop-shadow-md">
            Get answers. Find inspiration. Be more productive.
          </p>
        </div>
      </div>


      {/* ---------- right form ---------- */}
      <motion.div
        variants={fadeSlide}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-center px-8 py-12 lg:px-24"
      >
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mt-8 text-center text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h1>

          <form className="mt-10 space-y-6" noValidate onSubmit={handleSubmit}>
            {/* -------------- email -------------- */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md border px-3 py-2
                  text-gray-900 shadow-sm outline-none
                  focus:ring-2 focus:ring-slate-500
                  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* -------------- password -------------- */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md border px-3 py-2
                  text-gray-900 shadow-sm outline-none
                  focus:ring-2 focus:ring-slate-500
                  ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 cursor-pointer"
              >
                <Link href='/signup'>
                  Create an account
                </Link>
              </label>
            </div>

            {/* -------------- submit -------------- */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-black
                px-4 py-2 text-sm font-semibold text-white
                transition focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-black/30 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
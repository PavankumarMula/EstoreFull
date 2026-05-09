import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {useCreateUser} from "../hooks/userHook";


function SignUpPage() {

  const [formstate, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { mutate, isPending, error, isSuccess } = useCreateUser();

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // validateForm 
  const validateForm = () => {
    const newErrors = {};

    if (!formstate.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formstate.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formstate.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!formstate.password) {
      newErrors.password = "Password is required";
    } else if (formstate.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formstate.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formstate.password !==
      formstate.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    return newErrors;
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

   mutate(
  {
    name: formstate.name,
    email: formstate.email,
    password: formstate.password,
  },
  {
    onSuccess: () => {
      toast.success(
        "Account created successfully"
      );
    },

    onError: () => {
      toast.error(
        "Failed to create account"
      );
    },
  }
);
  }


  return (
    <div className="flex items-center justify-center min-h-[85vh]">

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-200">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h1>

          <p className="text-slate-500">
            Sign up to start shopping
          </p>

        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Name */}
          <div>

            <label className="block mb-2 font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
              name="name"
              value={formstate.name}
              onChange={handleChange}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-2">
                {errors.name}
              </p>
            )}

          </div>

          {/* Email */}
          <div>

            <label className="block mb-2 font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formstate.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email}
              </p>
            )}

          </div>

          {/* Password */}
          <div>

            <label className="block mb-2 font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formstate.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password}
              </p>
            )}

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block mb-2 font-medium text-slate-700">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formstate.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword}
              </p>
            )}

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        <p className="text-center mt-6 text-slate-600">

          Already have an account?{" "}

          <Link
            to="/signin"
            className="text-black font-semibold hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>
    </div>
  );
}

export default SignUpPage;
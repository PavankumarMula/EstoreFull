import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "../hooks/userHook";
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query";


function SignInPage() {
  const [formstate, setFormState] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending, error, isSuccess } = useSignIn();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

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

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with state:", formstate);
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    mutate(formstate, {
      onSuccess: async (data) => {

        // STORE TOKENS
        localStorage.setItem(
          "accessToken",
          data.tokens.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          data.tokens.refreshToken
        );

        toast.success(data.message);

        // REFRESH USER QUERY
        await queryClient.invalidateQueries({
          queryKey: ["currentUser"],
        });

        navigate("/");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "An error occurred");
      },
    });

  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-200">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-500">
            Sign in to continue shopping
          </p>

        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

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
              placeholder="Enter your password"
              name="password"
              value={formstate.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password}
              </p>
            )}

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition"
          >
            Sign In
          </button>

        </form>

        <p className="text-center mt-6 text-slate-600">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-black font-semibold hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default SignInPage;
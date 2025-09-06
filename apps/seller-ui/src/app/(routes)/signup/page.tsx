"use client";
import axios from "axios";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { countries } from "@/utils/Countries";

const SignupPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      );
      response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`,
        {
          ...userData,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  const onSubmit = (data: any) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input
    if (value) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (userData) signupMutation.mutate(userData);
  };

  const steps = ["Create Account", "Setup Shop", "Connect Bank"];

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      {/* Stepper */}
      <Box sx={{ width: "80%" }} className="py-7">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <div className="font-bold ">{label}</div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Steps Content */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 0 && (
          <>
            {!showOtp ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h3 className="text-2xl font-semibold text-center mb-2">
                    Create Account
                  </h3>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {String(errors.email.message)}
                    </p>
                  )}
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="info@example.com"
                    className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {String(errors.name.message)}
                    </p>
                  )}

                  <label className="block text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: +961 03 123 456"
                    className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
                    {...register("phone_number", {
                      required: "Phone Number is required",
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: "Invalid phone number",
                      },
                      minLength: {
                        value: 8,
                        message: "Phone number must be at least 8 digits",
                      },
                      maxLength: {
                        value: 15,
                        message: "Phone number cannot exceed 15 digits",
                      },
                    })}
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm">
                      {String(errors.phone_number.message)}
                    </p>
                  )}

                  <label className="block text-gray-700 mb-1">Country</label>
                  <select
                    className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4] text-gray-900"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    defaultValue=""
                  >
                    <option value="" disabled className="text-gray-400">
                      Select your country
                    </option>
                    {countries.map((country) => (
                      <option
                        key={country.code}
                        value={country.code}
                        className="text-gray-900"
                      >
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {String(errors.country.message)}
                    </p>
                  )}

                  <label className="block text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-3 flex items-center text-gray-400"
                    >
                      {passwordVisible ? (
                        <Eye width={18} height={18} />
                      ) : (
                        <EyeOff width={18} height={18} />
                      )}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {String(errors.password.message)}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all mt-4 disabled:bg-blue-400"
                  >
                    {signupMutation.isPending ? "Signin Up..." : "Sign Up"}
                  </button>
                  {signupMutation.isError &&
                    signupMutation.error instanceof AxiosError && (
                      <p className="text-red-500 text-sm">
                        {signupMutation.error.response?.data?.message ||
                          signupMutation.error.message}
                      </p>
                    )}
                  {serverError && (
                    <p className="text-red-500 text-sm mt-2">{serverError}</p>
                  )}
                </form>
                <div className="flex items-center my-5 text-gray-400 text-sm">
                  <div className="flex-1 border-t border-gray-300" />
                </div>
                <p className="text-center text-gray-400 mb-4 text-sm">
                  Already have an account?{" "}
                  <Link
                    href={"/login"}
                    className="text-blue-500 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-center mb-3">
                  Enter the OTP sent to your email
                </h3>
                <div className="flex justify-center gap-6">
                  {otp?.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="border border-gray-300 p-2 rounded-md w-12 text-center outline-[#4285F4]"
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <button
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all mt-4 disabled:bg-blue-400"
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                </button>
                <p className="text-center text-gray-400 mt-4 text-sm">
                  Didn't receive the code?{" "}
                  {canResend ? (
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={resendOtp}
                    >
                      Resend
                    </button>
                  ) : (
                    <span className="text-gray-500">
                      Resend in {timer} seconds
                    </span>
                  )}
                </p>
                {verifyOtpMutation?.isError &&
                  verifyOtpMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {verifyOtpMutation.error.response?.data?.message ||
                        verifyOtpMutation.error.message}
                    </p>
                  )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;

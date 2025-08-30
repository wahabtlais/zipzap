"use client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [serverError, setServerError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
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

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message: string })?.message ||
        "Invalid OTP! Try again.";
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "Invalid OTP! Try again.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        {
          email: userEmail,
          newPassword: password,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      setServerError(null);
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "Failed to reset password! Try again.");
    },
  });

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

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className="w-full py-10 h-screen min-h-[85vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {step === "email" && (
            <>
              <h3 className="text-2xl font-semibold text-center mb-4">
                Forgot Password
              </h3>

              <form onSubmit={handleSubmit(onSubmitEmail)}>
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
                {errors.email && (
                  <p className="text-red-500 text-sm mb-4">
                    {String(errors.email.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all mt-2 disabled:bg-blue-400"
                >
                  {requestOtpMutation.isPending ? "Submitting..." : "Submit"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}

          {step === "otp" && (
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
                    onClick={() =>
                      requestOtpMutation.mutate({ email: userEmail! })
                    }
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {timer} seconds
                  </span>
                )}
              </p>
              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </div>
          )}

          {step === "reset" && (
            <>
              <h3 className="text-2xl font-semibold text-center mb-3">
                Reset Password
              </h3>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="text"
                  placeholder="Enter your new password"
                  className="border border-gray-300 p-2 rounded-md w-full mb-4 outline-[#4285F4]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters.",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mb-4">
                    {String(errors.password.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all mt-2 disabled:bg-blue-400"
                >
                  {resetPasswordMutation.isPending
                    ? "Loading..."
                    : "Reset Password"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          )}
          <Link
            href={"/login"}
            className="text-gray-400 hover:text-gray-500 flex items-center transition-all text-sm mt-4"
          >
            <ChevronLeft width={18} height={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

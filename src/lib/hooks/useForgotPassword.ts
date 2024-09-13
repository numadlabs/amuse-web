import { useState } from "react";
import { usePasswordStore } from "../store/passwordStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  sendOtpApi,
  checkOtp,
  forgotPassword,
  checkEmail,
} from "../service/mutationHelper";
import { emailSchema } from "../validators/SignUpSchema";
import axios from "axios";
import { ZodError } from "zod";

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Error type
export interface ApiError {
  message: string;
  code?: string;
}

// Request types
export interface SendOtpRequest {
  email: string;
}

export interface CheckOtpRequest {
  email: string;
  verificationCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

// Hook return type
export interface UseForgotPasswordReturn {
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const { email, verificationCode, setEmail, setVerificationCode, reset } =
    usePasswordStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtpApi,
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
      setError("Error sending OTP. Please try again.");
    },
  });

  const { mutateAsync: checkOtpMutation } = useMutation({
    mutationFn: checkOtp,
  });

  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationFn: forgotPassword,
  });

  const { mutateAsync: checkEmailMutation } = useMutation({
    mutationFn: checkEmail,
    onError: (error) => {
      console.log(error);
    },
  });

  const sendOtpHandler = async (emailInput: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      emailSchema.parse(email);
      const checkEmailResponse = await checkEmailMutation({
        email: email,
      });
      if (!checkEmailResponse.data.isEmailRegistered) {
        setError("This email is not registered");
        throw new Error("This email is not registered");
      }
      const response = await sendOtpMutation({ email: emailInput });
      if (response.success) {
        setEmail(emailInput);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((issue) => issue.message);
        setError(formattedErrors.join("\n"));
        throw new Error(formattedErrors.join(", "));
      }
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data.error || "Failed to send OTP";
        throw new Error(apiError);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpHandler = async (code: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      const response = await checkOtpMutation({
        email,
        verificationCode: code,
      });

      if (response.success) {
        setVerificationCode(code);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data.error || "Failed to verify OTP";
        throw new Error(apiError);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordHandler = async (newPassword: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    const { email, verificationCode } = usePasswordStore.getState();

    try {
      const response = await resetPasswordMutation({
        email,
        verificationCode,
        password: newPassword,
      });
      if (response.success) {
        reset(); // Clear the store after successful password reset
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data.error || "Password reset failed";
        throw new Error(apiError);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOtp: sendOtpHandler,
    verifyOtp: verifyOtpHandler,
    resetPassword: resetPasswordHandler,
    isLoading,
    error,
    clearError,
  };
};

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
        // setError("This email is not registered");
        throw new Error("This email is not registered");
      }
      const response = await sendOtpMutation({ email: emailInput });
      if (response.success) {
        setEmail(emailInput);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred while sending OTP";

      if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((issue) => issue.message);
        errorMessage = formattedErrors.join(", ");
      } else if (axios.isAxiosError(err)) {
        // Handle Axios errors
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage =
            err.response.data.error ||
            err.response.data.message ||
            `Failed to send OTP: ${err.response.status}`;
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage =
            "No response received from the server. Please check your internet connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = err.message || "Error setting up the OTP request";
        }
      } else if (err instanceof Error) {
        // Handle standard JavaScript errors
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
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
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to verify OTP";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else if (err instanceof Error) {
        // Handle other errors
        setError(err.message);
        throw err;
      } else {
        // Handle unknown errors
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
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
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to verify OTP";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else if (err instanceof Error) {
        // Handle other errors
        setError(err.message);
        throw err;
      } else {
        // Handle unknown errors
        const errorMessage = "An unexpected error occurred";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
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

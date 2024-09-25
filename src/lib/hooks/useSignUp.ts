import { useState } from "react";
import { useSignUpStore } from "../store/signUpStore";
import { useMutation } from "@tanstack/react-query";
import {
  checkEmail,
  checkOtp,
  registerUser,
  sendOtpApi,
  verifyEmailOtp,
} from "../service/mutationHelper";
import { useRouter } from "next/router";
import { emailSchema } from "../validators/SignUpSchema";
import { ZodError } from "zod";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/auth-context";

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface SendOtpResponse extends ApiResponse {}

export interface VerifyOtpResponse extends ApiResponse {}

export interface RegisterResponse extends ApiResponse {
  userId?: string;
  token?: string;
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

export interface VerifyOtpRequest {
  email: string;
  verificationCode: string;
}

export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
  verificationCode: string;
}

// Hook return type
export interface UseSignUpReturn {
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<void>;
  register: (nickname: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Password validation types
export type PasswordValidationRule = (password: string) => boolean;

export interface PasswordValidationRules {
  minLength: PasswordValidationRule;
  hasUpperCase: PasswordValidationRule;
  hasLowerCase: PasswordValidationRule;
  hasNumber: PasswordValidationRule;
}

// Password validation rules
export const passwordValidationRules: PasswordValidationRules = {
  minLength: (password) => password.length >= 8,
  hasUpperCase: (password) => /[A-Z]/.test(password),
  hasLowerCase: (password) => /[a-z]/.test(password),
  hasNumber: (password) => /\d/.test(password),
};

export const isPasswordValid = (password: string): boolean =>
  Object.values(passwordValidationRules).every((rule) => rule(password));

// Custom hook
export const useSignUp = (): UseSignUpReturn => {
  const {
    email,
    password,
    verificationCode,
    setEmail,
    setVerificationCode,
    reset,
  } = useSignUpStore();
  const { onLogin } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const { mutateAsync: checkEmailMutation } = useMutation({
    mutationFn: checkEmail,
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: sendOtpMutation } = useMutation({
    mutationFn: sendOtpApi,
    onError: (error) => {
      console.log(error);
      setIsLoading(false);
      // setIsButtonDisabled(true);
      setError("Error sending OTP. Please try again.");
    },
  });

  const { mutateAsync: checkOtpMutation } = useMutation({
    mutationFn: checkOtp,
  });

  const sendOtp = async (emailInput: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      // Validate email
      emailSchema.parse(emailInput);

      // Check if email is already registered
      const checkEmailResponse = await checkEmailMutation({
        email: emailInput,
      });
      if (checkEmailResponse.data.isEmailRegistered) {
        throw new Error("This email is already registered.");
      }

      // Send OTP
      const response = await sendOtpMutation({ email: emailInput });
      if (response.success) {
        setEmail(emailInput);
      } else {
        throw new Error(response.message || "Failed to send OTP");
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred while sending OTP";

      if (err instanceof ZodError) {
        // Handle Zod validation errors
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

  const verifyOtp = async (code: string): Promise<void> => {
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
        // Handle the case where the API returns a failure response
        throw new Error(response.message || "Failed to verify OTP");
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

  const register = async (nickname: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    const { email, password, verificationCode } = useSignUpStore.getState();

    try {
      const response = await registerUser({
        nickname,
        email,
        password,
        verificationCode,
      });

      if (response.success) {
        const loginResponse = await onLogin(email, password);
        if (!loginResponse.error) {
          reset(); // Clear the store after successful registration
          await router.push("/home");
        } else {
          throw new Error(
            loginResponse.error ?? "Failed to log in after registration"
          );
        }
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred during registration";

      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage =
            err.response.data.error ||
            err.response.data.message ||
            `Registration failed: ${err.response.status}`;
        } else if (err.request) {
          // The request was made but no response was received
          errorMessage =
            "No response received from the server. Please check your internet connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage =
            err.message || "Error setting up the registration request";
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

  return {
    sendOtp,
    verifyOtp,
    register,
    isLoading,
    error,
    clearError,
  };
};

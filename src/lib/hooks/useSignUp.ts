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

// API response types
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  //TODO eniig ashiglaj shalgah
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
      const response = await sendOtpMutation({ email: emailInput });
      if (response.success) {
        setEmail(emailInput);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to send OTP");
      throw err;
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
        throw new Error(response.message);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to verify OTP");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nickname: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    const { email, password, verificationCode } = useSignUpStore.getState();
    console.log("🚀 ~ register ~ password:", password);

    try {
      const response = await registerUser({
        nickname,
        email,
        password,
        verificationCode,
      });
      if (response.success) {
        // Handle successful registration (e.g., store token, redirect)
        router.push("/home");
        reset(); // Clear the store after successful registration
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Registration failed");
      throw err;
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

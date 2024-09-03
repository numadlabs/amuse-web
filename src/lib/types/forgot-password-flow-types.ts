// Store types
interface PasswordStore {
  email: string;
  verificationCode: string;
  password: string;
  setEmail: (email: string) => void;
  setVerificationCode: (code: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

// Component prop types
interface StepComponentProps {
  onNext: () => void;
}

// API request types
interface SendOtpRequest {
  email: string;
}

interface CheckOtpRequest {
  email: string;
  verificationCode: string;
}

interface ForgotPasswordRequest {
  email: string;
  verificationCode: string;
  password: string;
}

// API response types
interface ApiResponse {
  success: boolean;
  message: string;
}

interface SendOtpResponse extends ApiResponse {}

interface CheckOtpResponse extends ApiResponse {}

interface ForgotPasswordResponse extends ApiResponse {}

// Validation types
type PasswordValidationRule = (password: string) => boolean;

interface PasswordValidationRules {
  minLength: PasswordValidationRule;
  hasUpperCase: PasswordValidationRule;
  hasLowerCase: PasswordValidationRule;
  hasNumber: PasswordValidationRule;
}

// Error types
interface ApiError {
  message: string;
  code?: string;
}

// Utility types
type Step = 1 | 2 | 3 | 4;

export type {
  PasswordStore,
  StepComponentProps,
  SendOtpRequest,
  CheckOtpRequest,
  ForgotPasswordRequest,
  ApiResponse,
  SendOtpResponse,
  CheckOtpResponse,
  ForgotPasswordResponse,
  PasswordValidationRule,
  PasswordValidationRules,
  ApiError,
  Step
};
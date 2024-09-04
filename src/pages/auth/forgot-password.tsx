import React, { useState } from "react";
import { Step } from "@/lib/types/forgot-password-flow-types";
import { useForgotPassword } from "@/lib/hooks/useForgotPassword";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, CheckCircle } from "lucide-react";
import Steps from "@/components/atom/steps";
import { usePasswordStore } from "@/lib/store/passwordStore";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

// Password validation rules (you can move these to a separate file if needed)
const passwordValidationRules = {
  minLength: (password: string) => password.length >= 8,
  hasUpperCase: (password: string) => /[A-Z]/.test(password),
  hasLowerCase: (password: string) => /[a-z]/.test(password),
  hasNumber: (password: string) => /\d/.test(password),
};

const isPasswordValid = (password: string): boolean => {
  return Object.values(passwordValidationRules).every((rule) => rule(password));
};

// Main ForgotPassword component
const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
        <CardContent className="p-6">
          <Steps activeStep={step} />
          {step === 1 && <EmailInput onNext={nextStep} />}
          {step === 2 && <OTPVerification onNext={nextStep} />}
          {step === 3 && <NewPassword onNext={nextStep} />}
          {step === 4 && <Success />}
        </CardContent>
      </Card>
    </div>
  );
};

// EmailInput component
const EmailInput: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { email, setEmail } = usePasswordStore();
  const { sendOtp, isLoading, error } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp(email);
      onNext();
    } catch (err) {
      // Error is handled by the hook and stored in the error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Forgot Password?</h2>
      <p className="text-gray-300 mb-4">
        We will send an email verification code.
      </p>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button type="submit" className="w-full" disabled={!email || isLoading}>
        {isLoading ? "Sending..." : "Send Code"}
      </Button>
    </form>
  );
};

// OTPVerification component
const OTPVerification: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { verificationCode, setVerificationCode } = usePasswordStore();
  const { verifyOtp, isLoading, error } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(verificationCode);
      onNext();
    } catch (err) {
      // Error is handled by the hook and stored in the error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Verification Code</h2>
      <p className="text-gray-300 mb-4">Enter the code sent to your email.</p>
      <Input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        className="mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-full"
        disabled={!verificationCode || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
};

// NewPassword component
const NewPassword: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { password, setPassword } = usePasswordStore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isLoading, error } = useForgotPassword();

  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid(password) && doPasswordsMatch) {
      try {
        await resetPassword(password);
        onNext();
      } catch (err) {
        // Error is handled by the hook and stored in the error state
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">
        Create New Password
      </h2>
      <div className="mb-4 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4"
      />
      {!doPasswordsMatch && (
        <p className="text-red-500 mb-4">Passwords do not match</p>
      )}
      <div className="mb-4">
        {Object.entries(passwordValidationRules).map(([key, rule]) => (
          <p
            key={key}
            className={`flex items-center ${
              rule(password) ? "text-green-500" : "text-gray-400"
            }`}
          >
            <Check size={16} className="mr-2" />
            {key === "minLength"
              ? "At least 8 characters"
              : `At least 1 ${key.slice(3).toLowerCase()}`}
          </p>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-full"
        disabled={!isPasswordValid(password) || !doPasswordsMatch || isLoading}
      >
        {isLoading ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
};

// Success component
const Success: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = usePasswordStore((state) => state.reset);

  const handleNavigation = () => {
    queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    router.replace("/");
    reset();
  };

  return (
    <div className="flex flex-col items-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Password Changed</h2>
      <p className="text-gray-300 text-center mb-4">
        Your password has been successfully changed.
      </p>
      <Button onClick={handleNavigation} className="w-full">
        Back to Home
      </Button>
    </div>
  );
};

export default ForgotPassword;

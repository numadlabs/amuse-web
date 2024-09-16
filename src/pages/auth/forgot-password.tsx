import React, { useState } from "react";
import { Step } from "@/lib/types/forgot-password-flow-types";
import { useForgotPassword } from "@/lib/hooks/useForgotPassword";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check } from "lucide-react";
import Steps from "@/components/atom/steps";
import { usePasswordStore } from "@/lib/store/passwordStore";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ArrowLeft } from "iconsax-react";

// Password validation rules
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
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, 4) as Step);
  const prevStep = () =>
    setStep((prevStep) => Math.max(prevStep - 1, 1) as Step);
  const handleBackClick = () => {
    if (step === 1) {
      router.push("/");
    } else {
      prevStep();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <EmailInput onNext={nextStep} />;
      case 2:
        return <OTPVerification onNext={nextStep} />;
      case 3:
        return <NewPassword onNext={nextStep} />;
      case 4:
        return <Success />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative">
      {step >= 1 && (
        <button
          // onClick={prevStep}
          onClick={handleBackClick}
          className="fixed top-4 left-4 z-10 p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size="24" color="#d7dadc" />
        </button>
      )}
      <Card className="w-full max-w-md border-none bg-transparent text-center">
        <CardContent className="p-0">
          <Steps activeStep={step} />
          {renderStep()}
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 p-4 w-full bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
      <p className="text-gray100 text-sm">
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
      <Button
        type="submit"
        className="w-full h-12"
        disabled={!email || isLoading}
      >
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Verification Code</h2>
      <p className="text-gray100 text-sm">Enter the code sent to your email.</p>
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
        className="w-full h-12"
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Create New Password</h2>
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      />
      {!doPasswordsMatch && (
        <p className="text-red-500">Passwords do not match</p>
      )}
      <div className="text-left">
        {Object.entries(passwordValidationRules).map(([key, rule]) => (
          <p
            key={key}
            className={`flex items-center ${
              rule(password) ? "text-systemSuccess" : "text-gray-400"
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
        className="w-full h-12 mt-4"
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
  // const queryClient = useQueryClient();
  const reset = usePasswordStore((state) => state.reset);

  const handleNavigation = () => {
    // queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    router.replace("/");
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl">
      <Image
        src="/images/success.png"
        alt="Success"
        width={72}
        height={72}
        sizes="100%"
      />
      <h2 className="text-2xl font-bold text-white">Password Changed</h2>
      <p className="text-gray100 text-sm">
        Your password has been changed successfully.
      </p>
      <Button
        onClick={handleNavigation}
        variant="secondary"
        className="w-full h-12 mt-4"
      >
        Go to Login
      </Button>
    </div>
  );
};

export default ForgotPassword;

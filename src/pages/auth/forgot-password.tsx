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
import Image from "next/image";
import { ArrowLeft } from "iconsax-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  isPasswordValid,
  passwordValidationRules,
} from "@/lib/hooks/useSignUp";
import { passwordSchema } from "@/lib/validators/SignUpSchema";
// import { Input, Button } from '@/components/ui'; // Adjust import path as needed
// import { usePasswordStore, useForgotPassword } from '@/hooks'; // Adjust import path as needed
import { UseForgotPasswordReturn } from "@/lib/hooks/useForgotPassword";

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
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <div className="h-14 max-w-[480px] w-full flex justify-center items-center relative">
        <p className="text-lg text-gray50 font-bold">Forgot password?</p>
        {step >= 1 && (
          <button
            onClick={handleBackClick}
            className="absolute top-0 left-0 h-14 w-14 rounded-full shadow-lg transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft size="24" color="#d7dadc" />
          </button>
        )}
      </div>
      <Card className="w-full max-w-[480px] border-none bg-transparent text-center mt-10">
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
  const handleOTPChange = (value: string) => {
    setVerificationCode(value);
  };

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
      <div className="w-full flex justify-center mb-4">
        <InputOTP
          maxLength={4}
          value={verificationCode}
          onChange={handleOTPChange}
        >
          <InputOTPGroup className="flex flex-row gap-3">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const doPasswordsMatch = password === confirmPassword;

  const validatePassword = (password: string) => {
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setValidationErrors(result.error.errors.map(err => err.message));
      return false;
    }
    setValidationErrors([]);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(password) && doPasswordsMatch) {
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
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
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
        {validationErrors.map((error, index) => (
          <p key={index} className="text-red-500">{error}</p>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-full h-12 mt-4"
        disabled={validationErrors.length > 0 || !doPasswordsMatch || isLoading}
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

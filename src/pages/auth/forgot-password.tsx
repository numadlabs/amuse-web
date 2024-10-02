import React, { useState, useEffect } from "react";
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
import { passwordSchema } from "@/lib/validators/SignUpSchema";

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
  const [validationRules, setValidationRules] = useState([
    { rule: "At least 8 characters", valid: false },
    { rule: "At least 1 uppercase case letter (A-Z)", valid: false },
    { rule: "At least 1 lower case letter (a-z)", valid: false },
    { rule: "At least 1 number (0-9)", valid: false },
  ]);

  const doPasswordsMatch = password === confirmPassword;

  const validatePassword = (password: string) => {
    const newValidationRules = validationRules.map((rule) => {
      switch (rule.rule) {
        case "At least 8 characters":
          return { ...rule, valid: password.length >= 8 };
        case "At least 1 uppercase case letter (A-Z)":
          return { ...rule, valid: /[A-Z]/.test(password) };
        case "At least 1 lower case letter (a-z)":
          return { ...rule, valid: /[a-z]/.test(password) };
        case "At least 1 number (0-9)":
          return { ...rule, valid: /[0-9]/.test(password) };
        default:
          return rule;
      }
    });
    setValidationRules(newValidationRules);
    return newValidationRules.every((rule) => rule.valid);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

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
      <div className="flex flex-col gap-2">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {!doPasswordsMatch && (
        <p className="px-4 text-sm text-systemError text-start">Password doesn&apos;t match</p>
      )}
      </div>
      <div className="text-left flex flex-col gap-1">
        {validationRules.map((rule, index) => (
          <p
            key={index}
            className={`flex items-center gap-2 text-sm ${
              rule.valid ? "text-systemSuccess" : "text-gray100"
            }`}
          >
            {rule.valid ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {rule.rule}
          </p>
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-full h-12 mt-4"
        disabled={
          !validationRules.every((rule) => rule.valid) ||
          !doPasswordsMatch ||
          isLoading
        }
      >
        {isLoading ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
};

// Success component
const Success: React.FC = () => {
  const router = useRouter();
  const reset = usePasswordStore((state) => state.reset);

  const handleNavigation = () => {
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

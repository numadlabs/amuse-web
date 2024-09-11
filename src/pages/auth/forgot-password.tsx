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
import Image from "next/image";
import { ArrowLeft } from "iconsax-react";

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
  // const [step, setStep] = useState<Step>(1);

  // const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6">
           {step > 1 && step < 4 && (
            <div  onClick={prevStep} className="relative right-40 top-0">
              <ArrowLeft size="24" color="#d7dadc"/>
            </div>
          )}
      <Card className="border-none bg-transparent text-center">
        
        <CardContent className="">
          
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center max-w-[480px] w-screen gap-4 pt-6 pr-4 pb-4 pl-4 h-[180px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Forgot Password?</h2>
      <p className="text-gray100 text-sm font-normal">
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
        className="max-w-[480px] w-screen h-12 absolute bottom-32"
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
      className="flex flex-col justify-center max-w-[480px] w-screen gap-4 pt-6 pr-4 pb-4 pl-4 h-[180px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Verification Code</h2>
      <p className="text-gray100 text-sm font-normal">
        Enter the code sent to your email.
      </p>
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
        className="max-w-[480px] w-screen h-12 absolute bottom-32"
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
      className="flex flex-col justify-center h-[382px] max-w-[480px] w-screen gap-6 pt-4 pr-4 pb-4 pl-4 items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Create New Password</h2>
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
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
        className=""
      />
      {!doPasswordsMatch && (
        <p className="text-red-500 mb-4">Passwords do not match</p>
      )}
      <div className="relative right-[69px]">
        {Object.entries(passwordValidationRules).map(([key, rule]) => (
          <p
            key={key}
            className={`flex items-center text-start  ${
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
        className="max-w-[480px] w-screen h-12 absolute bottom-32"
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
    <div className="flex flex-col items-center justify-center max-w-[480px] w-screen gap-4 pt-6 pr-4 pb-4 pl-4 h-[190px] bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]">
      {/* <CheckCircle className="w-16 h-16 text-green-500 mb-4" /> */}
      <Image
        src={"/images/success.png"}
        alt="image"
        width={72}
        height={72}
        sizes="100%"
        // className="rounded-xl h-[80px] hover:rounded-[32px] hover:w-[200px] md:hover:w-[300px] lg:hover:w-[400px] hover:h-[200px] md:hover:h-[300px] lg:hover:h-[400px] zoom"
      />
      <h2 className="text-xl font-bold text-white">Password Changed</h2>
      <p className="text-gray100 text-sm2 font-normal">
        Your password has been changed.
      </p>
      <Button
        onClick={handleNavigation}
        variant="secondary"
        className="max-w-[480px] w-screen h-12 absolute bottom-32"
      >
        Go to Login
      </Button>
    </div>
  );
};

export default ForgotPassword;

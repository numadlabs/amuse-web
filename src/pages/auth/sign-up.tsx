import React, { useState } from "react";
import { Step } from "@/lib/types/forgot-password-flow-types";
import {
  useSignUp,
  isPasswordValid,
  passwordValidationRules,
} from "@/lib/hooks/useSignUp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check } from "lucide-react";
import Steps from "@/components/atom/steps";
import { useSignUpStore } from "@/lib/store/signUpStore";
import { ArrowLeft } from "iconsax-react";

// Main SignUp component
const SignUp: React.FC = () => {
  // const [step, setStep] = useState<Step>(1);
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-6">
      {step > 1 && step < 4 && (
        <div onClick={prevStep} className="relative right-40 top-0">
          <ArrowLeft size="24" color="#d7dadc" />
        </div>
      )}
      <Card className="border-none bg-transparent text-center">
        <CardContent className="">
          <Steps activeStep={step} />
          {step === 1 && <EmailInput onNext={nextStep} />}
          {step === 2 && <OTPVerification onNext={nextStep} />}
          {step === 3 && <Password onNext={nextStep} />}
          {step === 4 && <Nickname />}
        </CardContent>
      </Card>
    </div>
  );
};

// Steps component remains the same

// EmailInput component
const EmailInput: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  //email register hiisniig shalgah
  const { email, setEmail } = useSignUpStore();
  const { sendOtp, isLoading, error } = useSignUp();

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
      className="flex flex-col justify-center max-w-[960px] gap-4 pt-6 pr-4 pb-4 pl-4 w-[343px] h-[180px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Email</h2>
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
        className="w-[343px] h-12 absolute bottom-32"
        disabled={!email || isLoading}
      >
        {isLoading ? "Sending..." : "Send code"}
      </Button>
    </form>
  );
};

// OTPVerification component
const OTPVerification: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { verificationCode, setVerificationCode } = useSignUpStore();
  const { verifyOtp, isLoading, error } = useSignUp();

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
      className="flex flex-col justify-center max-w-[960px] gap-4 pt-6 pr-4 pb-4 pl-4 w-[343px] h-[200px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Verification code</h2>
      <p className="text-gray100 text-sm font-normal">
        Enter the code sent to your email.
      </p>
      <Input
        type="number"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        className="mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-[343px] h-12 absolute bottom-32"
        disabled={!verificationCode || isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
};

// Password component
const Password: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { password, setPassword } = useSignUpStore();
  console.log("🚀 ~ password:", password);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPasswordValid(password) && doPasswordsMatch) {
      onNext();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center h-[382px] max-w-[960px] gap-6 pt-4 pr-4 pb-4 pl-4 w-[343px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Create password</h2>
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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
        className="mb-4"
      />
      {!doPasswordsMatch && (
        <p className="text-red-500 h-4">Passwords do not match</p>
      )}
      <div className="relative right-[69px]">
        {Object.entries(passwordValidationRules).map(([key, rule]) => (
          <p
            key={key}
            className={`flex items-center text-start ${
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
      <Button
        type="submit"
        className="w-[343px] h-12 absolute bottom-32"
        disabled={!isPasswordValid(password) || !doPasswordsMatch}
      >
        Continue
      </Button>
    </form>
  );
};

// Nickname component
const Nickname: React.FC = () => {
  const { nickname, setNickname } = useSignUpStore();
  const { register, isLoading, error } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(nickname);
      // if (response.success) {
      //   router.push("/home");
      // }
    } catch (err) {
      // Error is handled by the hook and stored in the error state
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center max-w-[960px] gap-4 pt-6 pr-4 pb-4 pl-4 w-[343px] h-[210px] items-center bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-[32px]"
    >
      <h2 className="text-faq font-bold text-white">Nickname</h2>
      <p className="text-gray100 text-sm font-normal">
        This will be shared with others. We want exclusive <br /> invites to
        feel special.
      </p>
      <Input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="mb-4"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button
        type="submit"
        className="w-[343px] h-12 absolute bottom-32"
        disabled={!nickname || isLoading}
      >
        {isLoading ? "Finishing..." : "Finish"}
      </Button>
    </form>
  );
};

export default SignUp;

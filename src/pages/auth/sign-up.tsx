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

// Main SignUp component
const SignUp: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
        <CardContent className="p-6">
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
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Email</h2>
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
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Verification code</h2>
      <p className="text-gray-300 mb-4">Enter the code sent to your email.</p>
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
        className="w-full"
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
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Create password</h2>
      <div className="mb-4 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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
      <Button
        type="submit"
        className="w-full"
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
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-white mb-4">Nickname</h2>
      <p className="text-gray-300 mb-4">
        This will be shared with others. We want exclusive invites to feel
        special.
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
        className="w-full"
        disabled={!nickname || isLoading}
      >
        {isLoading ? "Finishing..." : "Finish"}
      </Button>
    </form>
  );
};

export default SignUp;

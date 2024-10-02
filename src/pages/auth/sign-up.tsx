import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { passwordSchema } from "@/lib/validators/SignUpSchema";
// import { Input, Button } from '@/components/ui'; // Adjust import path as needed
// import { usePasswordStore, useForgotPassword } from '@/hooks'; // Adjust import path as needed
import { UseForgotPasswordReturn } from "@/lib/hooks/useForgotPassword";

// Main SignUp component
const SignUp: React.FC = () => {
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
        return <Password onNext={nextStep} />;
      case 4:
        return <Nickname />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <div className="h-14 max-w-[480px] w-full flex justify-center items-center relative">
        <p className="text-lg text-gray50 font-bold">Sign Up</p>
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

  const handleOTPChange = (value: string) => {
    setEmail(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center gap-4 p-4 w-full bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Email</h2>
      <p className="text-gray100 text-sm">
        We will send an email verification code.
      </p>
      {/* <div className="w-full flex justify-center mb-4">
        <InputOTP maxLength={4} value={email} onChange={handleOTPChange}>
          <InputOTPGroup className="flex flex-row gap-3">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div> */}
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
        {isLoading ? "Sending..." : "Send code"}
      </Button>
      <p>For a more seamless experience, we recommend using mainstream email services like Gmail, Yahoo, Outlook.</p>
    </form>
  );
};

// OTPVerification component
const OTPVerification: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { verificationCode, setVerificationCode } = useSignUpStore();
  const { verifyOtp, isLoading, error } = useSignUp();
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
      <h2 className="text-2xl font-bold text-white">Verification code</h2>
      <p className="text-gray100 text-sm">Enter the code sent to your email.</p>
      {/* <Input
        type="number"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        className="mb-4"
      /> */}
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

// Password component
const Password: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { password, setPassword } = useSignUpStore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // const validatePassword = (password: string) => {
  //   const result = passwordSchema.safeParse(password);
  //   if (!result.success) {
  //     setValidationErrors(result.error.errors.map((err) => err.message));
  //     return false;
  //   }
  //   setValidationErrors([]);
  //   return true;
  // };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(password) && doPasswordsMatch) {
      onNext();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Create password</h2>
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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
      <div className="flex flex-col gap-2">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!doPasswordsMatch && (
          <p className="px-4 text-sm text-systemError text-start">
            Password doesn&apos;t match
          </p>
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
      <Button
        type="submit"
        className="w-full h-12 mt-4"
        disabled={validationErrors.length > 0 || !doPasswordsMatch}
      >
        Continue
      </Button>
    </form>
  );
};
// const Password: React.FC<{ onNext: () => void }> = ({ onNext }) => {
//   const { password, setPassword } = useSignUpStore();
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const doPasswordsMatch = password === confirmPassword;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isPasswordValid(password) && doPasswordsMatch) {
//       onNext();
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
//     >
//       <h2 className="text-2xl font-bold text-white">Create password</h2>
//       <div className="relative w-full">
//         <Input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//         >
//           {showPassword ? (
//             <EyeOff className="h-5 w-5 text-gray-400" />
//           ) : (
//             <Eye className="h-5 w-5 text-gray-400" />
//           )}
//         </button>
//       </div>
//       <Input
//         type={showPassword ? "text" : "password"}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         className="mb-4"
//       />
//       {!doPasswordsMatch && (
//         <p className="text-red-500">Passwords do not match</p>
//       )}
//       <div className="text-left">
//         {Object.entries(passwordValidationRules).map(([key, rule]) => (
//           <p
//             key={key}
//             className={`flex items-center ${
//               rule(password) ? "text-systemSuccess" : "text-gray-400"
//             }`}
//           >
//             <Check size={16} className="mr-2" />
//             {key === "minLength"
//               ? "At least 8 characters"
//               : `At least 1 ${key.slice(3).toLowerCase()}`}
//           </p>
//         ))}
//       </div>
//       <Button
//         type="submit"
//         className="w-full h-12 mt-4"
//         disabled={!isPasswordValid(password) || !doPasswordsMatch}
//       >
//         Continue
//       </Button>
//     </form>
//   );
// };

// Nickname component
const Nickname: React.FC = () => {
  const { nickname, setNickname } = useSignUpStore();
  const { register, isLoading, error } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(nickname);
    } catch (err) {
      // Error is handled by the hook and stored in the error state
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center w-full gap-4 p-4 bg-gradient-to-br from-gray500 to-transparent border border-gray400 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-white">Nickname</h2>
      <p className="text-gray100 text-sm">
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
        className="w-full h-12"
        disabled={!nickname || isLoading}
      >
        {isLoading ? "Finishing..." : "Finish"}
      </Button>
    </form>
  );
};

export default SignUp;

import create from 'zustand';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import {
  PasswordStore,
  StepComponentProps,
  SendOtpRequest,
  CheckOtpRequest,
  ForgotPasswordRequest,
  ApiResponse,
  PasswordValidationRules,
  Step
} from '@/lib/types/forgot-password-flow-types';

// Zustand store
const usePasswordStore = create<PasswordStore>((set) => ({
  email: '',
  verificationCode: '',
  password: '',
  setEmail: (email) => set({ email }),
  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setPassword: (password) => set({ password }),
  reset: () => set({ email: '', verificationCode: '', password: '' }),
}));

// Email Input Component
const EmailInput: React.FC<StepComponentProps> = ({ onNext }) => {
  const { email, setEmail } = usePasswordStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement sendOtp API call
      // await sendOtp({ email });
      setLoading(false);
      onNext();
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Forgot Password?</h2>
        <p className="text-gray-300 mb-4">We will send an email verification code.</p>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full" disabled={!email || loading}>
            {loading ? 'Sending...' : 'Send Code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// OTP Verification Component
const OTPVerification: React.FC<StepComponentProps> = ({ onNext }) => {
  const { email, verificationCode, setVerificationCode } = usePasswordStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement checkOtp API call
      // await checkOtp({ email, verificationCode });
      setLoading(false);
      onNext();
    } catch (error) {
      setError('Invalid code');
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Verification Code</h2>
        <p className="text-gray-300 mb-4">Enter the code sent to your email.</p>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="mb-4"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" className="w-full" disabled={!verificationCode || loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// New Password Component
const NewPassword: React.FC<StepComponentProps> = ({ onNext }) => {
  const { email, verificationCode, password, setPassword } = usePasswordStore();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRules: PasswordValidationRules = {
    minLength: (password) => password.length >= 8,
    hasUpperCase: (password) => /[A-Z]/.test(password),
    hasLowerCase: (password) => /[a-z]/.test(password),
    hasNumber: (password) => /\d/.test(password),
  };

  const isPasswordValid = (password: string): boolean => {
    return Object.values(passwordRules).every((rule) => rule(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement forgotPassword API call
      // await forgotPassword({ email, verificationCode, password });
      setLoading(false);
      onNext();
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Create New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <Input
              type={showPassword ? 'text' : 'password'}
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
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
          {password !== confirmPassword && (
            <p className="text-red-500 mb-4">Passwords do not match</p>
          )}
          <div className="mb-4">
            {Object.entries(passwordRules).map(([key, rule]) => (
              <p key={key} className={`text-sm ${rule(password) ? 'text-green-500' : 'text-gray-400'}`}>
                ✓ {key === 'minLength' ? 'At least 8 characters' : `At least 1 ${key.slice(3).toLowerCase()}`}
              </p>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isPasswordValid(password) || password !== confirmPassword || loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Success Component
const Success: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = usePasswordStore((state) => state.reset);

  const handleNavigation = () => {
    queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    router.replace('/');
    reset();
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-b from-purple-700 to-purple-900 border border-gray-700">
      <CardContent className="p-6 flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Password Changed</h2>
        <p className="text-gray-300 text-center mb-4">Your password has been successfully changed.</p>
        <Button onClick={handleNavigation} className="w-full">
          Back to Home
        </Button>
      </CardContent>
    </Card>
  );
};

// Main ForgotPassword Component
const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>(1);

  const nextStep = () => setStep((prevStep) => (prevStep + 1) as Step);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      {step === 1 && <EmailInput onNext={nextStep} />}
      {step === 2 && <OTPVerification onNext={nextStep} />}
      {step === 3 && <NewPassword onNext={nextStep} />}
      {step === 4 && <Success />}
    </div>
  );
};

export default ForgotPassword;
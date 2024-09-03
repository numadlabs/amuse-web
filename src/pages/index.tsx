import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useAuth } from "@/lib/context/auth-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const router = useRouter();
  const { onLogin } = useAuth();
  // const { toast } = useToast()

  useEffect(() => {
    checkWelcomeMessageStatus();
  }, []);

  const checkWelcomeMessageStatus = async () => {
    try {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeMessage");
      if (hasSeenWelcome !== "true") {
        setShowWelcomeMessage(true);
      }
    } catch (error) {
      console.error("Error checking welcome message status:", error);
    }
  };

  const dismissWelcomeMessage = async () => {
    try {
      localStorage.setItem("hasSeenWelcomeMessage", "true");
      setShowWelcomeMessage(false);
    } catch (error) {
      console.error("Error saving welcome message status:", error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await onLogin(email, password);
      if (response.success) {
        router.push("/home");
        toast.success("Welcome");
      } else {
        setError("Email and/or password do not match our records");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login Error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <Image
            src="/images/LogoDark.png"
            alt="Logo"
            width={96}
            height={96}
            className="mx-auto mb-6"
          />
          <CardTitle className="text-white text-2xl">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-10"
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
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              variant="ghost"
              className="text-white w-full"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>
          <div className="mt-4 border-t border-gray-700 pt-4">
            <Button
              variant="secondary"
              className="w-full text-white border-gray-700 hover:bg-gray-800"
              onClick={() => router.push("/auth/sign-up")}
            >
              Sign up
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            By continuing, I agree with Amuse-Bouche&apos;s{" "}
            <Button
              variant="ghost"
              className="text-white p-0"
              onClick={() => router.push("/terms")}
            >
              Terms and Conditions.
            </Button>
          </p>
        </CardContent>
      </Card>

      <Dialog open={showWelcomeMessage} onOpenChange={setShowWelcomeMessage}>
        <DialogContent className="bg-gray-900 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Welcome to Amuse Bouche!
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4 text-gray-300">
            <p>
              Welcome to Amuse Bouche! We are excited to welcome you to our
              growing community!
            </p>
            <p>
              Here at Amuse Bouche, we value transparency with our users. So,
              please note that while using the Amuse Bouche Application, certain
              user data will be collected. To enable account creation and
              continued user access, it is necessary that user email data is
              collected. Additionally, user experience is unique to each
              location, which requires user location data to also be collected.
            </p>
            <p>
              Aside from user email and location data collection, the rest is up
              to you! You can opt to allow the collection of data such as your
              birthday and profile picture. Opting-in allows us here at Amuse
              Bouche to continue to improve the application so we can provide a
              more seamless and tailored user experience for you.
            </p>
            <p>
              Your privacy is important, and what data you choose to disclose is
              totally up to you! To change your data collection preferences, you
              can go to the privacy section of the settings menu and view the
              data collection options.
            </p>
            <p className="font-semibold">
              Thank you for choosing Amuse Bouche!
            </p>
          </DialogDescription>
          <Button onClick={dismissWelcomeMessage} className="w-full mt-4">
            I understand
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

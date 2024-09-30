import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const router = useRouter();
  const { onLogin, status } = useAuth();

  // const { toast } = useToast()

  useEffect(() => {
    checkWelcomeMessageStatus();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    }
  }, [status, router]);

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
      console.log("🚀 ~ handleLogin ~ response:", response);
      if (!response.error) {
        // router.push("/home");
        toast.success("Welcome");
      } else {
        setError(response.error ?? "Unknown error happened");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="animate-spin" color="#FFFFFF" size={48} />
      </div>
    );
  }
  // if (status === "authenticated") {
  //   router.push("/home");
  //   return null;
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="max-w-[480px] w-full bg-gray500 border border-gray400 rounded-[32px]">
        <CardHeader className="text-center">
          <Image
            src="/img/LogoDark.png"
            alt="Logo"
            width={96}
            height={96}
            className="mx-auto mb-6"
          />
          <CardTitle className="font-bold text-white font-aboutUs">
            Welcome
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
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
                className="bg-transparent border-gray300 text-gray100 pt-[14px] pr-4 pb-[14px] pl-4"
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-gray300 text-white pt-[14px] pr-4 pb-[14px] pl-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? "Loading..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4">
            <Button
              variant="ghost"
              className="w-full font-semibold text-white font-md2"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-full h-[1px] bg-gray400" />
            <div className="flex items-center text-sm font-normal text-gray50">
              or
            </div>
            <div className="w-full h-[1px] bg-gray400" />
          </div>
          <div className="pt-4">
            <Button
              variant="secondary"
              className="w-full h-12 text-white"
              onClick={() => router.push("/auth/sign-up")}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="relative text-center top-14">
        <p className="text-sm text-center text-gray-400">
          By continuing, I agree with Amuse-Bouche&apos;s{" "}
        </p>
        {/* <Button
          variant="ghost"
          className="font-normal text-white text-md"
          onClick={() => router.push("/terms")}
        >
          Terms and Conditions.
        </Button> */}
        <Link
          href="https://www.amusebouche.io/terms-conditions"
          passHref
          legacyBehavior
        >
          <a target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="font-normal text-white text-md">
              Terms and Conditions
            </Button>
          </a>
        </Link>
      </div>

      <Dialog open={showWelcomeMessage} onOpenChange={setShowWelcomeMessage}>
        <DialogContent className="bg-background w-[320px] xs2:w-[320px] xs:w-[360px]  sm:w-[480px] h-[575px] md:h-[598px] flex flex-col justify-around p-5 rounded-xl border-hidden">
          <ScrollArea className="h-[478px] rounded-md border-hidden">
            <DialogHeader>
              <DialogTitle className="pb-4 font-bold text-gray00 text-faq text-start">
                <span className="text-gray00">
                  Welcome to <br /> Amuse Bouche!
                </span>
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="space-y-4 font-normal text-gray100">
              <p>
                Welcome to Amuse Bouche! We are excited to welcome you to our
                growing community!
              </p>
              <p>
                We’re thrilled to have you join our Pilot Program, and we
                greatly appreciate your participation. This program allows us to
                refine Amuse Bouche’s features, ensuring it becomes the best
                experience possible for our entire community, including you!
              </p>
              <p>
                Here at Amuse Bouche, we value transparency with our users. So,
                please note that while using the Amuse Bouche Application,
                certain user data will be collected. To enable account creation
                and continued user access, it is necessary that user email data
                is collected. Additionally, user experience is unique to each
                location, which requires user location data to also be
                collected.
              </p>
              <p>
                Aside from user email and location data collection, the rest is
                up to you! You can opt to allow the collection of data such as
                your birthday and profile picture. Opting-in allows us here at
                Amuse Bouche to continue to improve the application so we can
                provide a more seamless and tailored user experience for you.
              </p>
              <p>
                Your privacy is important, and what data you choose to disclose
                is totally up to you! To change your data collection
                preferences, you can go to the privacy section of the settings
                menu and view the data collection options.
              </p>
              <p>
                One final note, to ensure security and smooth operations during
                the Pilot Program, some features will be limited. Specifically,
                you won’t be able to withdraw or transfer any bitcoin earned
                until the Pilot Program ends. We’ll notify all users via email
                and app notification as soon as the Pilot Program is completed.
              </p>
              <p className="font-semibold">
                We are excited to have you as a part of our growing community!
              </p>
            </DialogDescription>
          </ScrollArea>

          <Button
            onClick={dismissWelcomeMessage}
            variant={"primary"}
            className="w-full mt-4"
          >
            I understand
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

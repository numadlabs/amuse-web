import { ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import Header from "./header-comp";
import BottomNavigation from "./bottom-navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

import { Sora } from "next/font/google";
import BugReportButton from "../atom/bug-report";
const sora = Sora({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = sora.className;

interface AuthenticatedLayoutProps {
  children: ReactNode;
  headerType?: "blank" | "default" | "page";
  headerTitle?: string;
  bottomNavigationType?: "Modal" | "default";
}

export default function AuthenticatedLayout({
  children,
  headerType,
  headerTitle,
  bottomNavigationType = "default",
}: AuthenticatedLayoutProps) {
  const router = useRouter();

  const determineHeaderType = () => {
    if (headerType) return headerType;

    if (router.pathname === "/restaurants" && router.query.id) {
      return "blank";
    }

    switch (router.pathname) {
      case "/home":
        return "default";
      case "/profile":
        return "page";
      case "/settings":
        return "page";
      case "/notifications":
        return "page";
      default:
        return "default";
    }
  };

  const determineHeaderTitle = () => {
    if (headerTitle) return headerTitle;

    switch (router.pathname) {
      case "/profile":
        return "Profile";
      case "/settings":
        return "Settings";
      case "/notifications":
        return "Notifications";
      default:
        return "";
    }
  };

  const headerTypeToUse = determineHeaderType();

  return (
    <div className="bg-background">
      <div
        className={`flex flex-col w-full h-full min-h-screen max-w-[480px] mx-auto items-center overflow-hidden ${subClass}`}
      >
        {headerTypeToUse !== "blank" && (
          <div className="z-50">
            <Header type={headerTypeToUse} title={determineHeaderTitle()} />
          </div>
        )}

        <div
          className={`w-full flex-grow overflow-y-auto ${
            headerTypeToUse === "blank" ? "pt-0" : "pt-16"
          } ${bottomNavigationType === "default" ? "pb-20" : ""}`}
        >
          {/* <div className="hidden lg:block"> <OnlyMobileWarning /> </div> */}
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-grow z-0 mx-4"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <Toaster />
        </div>
        <BugReportButton />
        {headerTypeToUse === "default" && (
          <BottomNavigation type={bottomNavigationType} />
        )}
      </div>
    </div>
  );
}

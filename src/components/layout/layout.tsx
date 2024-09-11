import { ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import Header from "./header-comp";
import BottomNavigation from "./bottom-navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

import { Sora } from "next/font/google";
const sora = Sora({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = sora.className;

interface AuthenticatedLayoutProps {
  children: ReactNode;
  headerType?: 'blank' | 'default' | 'page';
  headerTitle?: string;
}

export default function AuthenticatedLayout({
  children,
  headerType,
  headerTitle,
}: AuthenticatedLayoutProps) {
  const router = useRouter();

  // Determine header type based on route if not explicitly provided
  const determineHeaderType = () => {
    if (headerType) return headerType;
    
    switch (router.pathname) {
      case '/home':
        return 'default';
      case '/profile':
        return 'page';
      case '/settings':
        return 'page';
      case '/notifications':
        return 'page';
      // Add more cases as needed
      default:
        return 'default';
    }
  };

  // Determine header title based on route if not explicitly provided
  const determineHeaderTitle = () => {
    if (headerTitle) return headerTitle;
    
    switch (router.pathname) {
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      case '/notifications':
        return 'Notifications';
      default:
        return '';
    }
  };

  return (
    <div className="bg-background">
      <div
        className={`flex flex-col w-full h-full min-h-screen max-w-[600px] mx-auto items-center overflow-hidden ${subClass}`}
      >
        <Header 
          type={determineHeaderType()} 
          title={determineHeaderTitle()} 
        />

        <div className="w-full flex-grow overflow-y-auto">
          <div className="hidden lg:block">{/* <OnlyMobileWarning /> */}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-grow z-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <Toaster />
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}
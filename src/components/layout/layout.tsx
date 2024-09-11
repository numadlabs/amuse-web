import { ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import Header from "./header-comp";
import BottomNavigation from "./bottom-navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="bg-background">
      <div
        className={`flex flex-col w-full h-full min-h-screen max-w-[600px] mx-auto items-center`}
      >
        <Header />

        <div className="w-full flex-grow">
          <div className="hidden lg:block">{/* <OnlyMobileWarning /> */}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-grow"
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

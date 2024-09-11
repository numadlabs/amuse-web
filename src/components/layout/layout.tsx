import { ReactNode } from "react";
import { Toaster } from "../ui/sonner";
import Header from "./header-comp";
import BottomNavigation from "./bottom-navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-background">
      <div
        className={`flex flex-col w-full h-full  min-h-screen max-w-[600px] mx-auto items-center`}
      >
        <Header />

        <div className="w-full">
          <div className="hidden lg:block">{/* <OnlyMobileWarning /> */}</div>
          {children}
          <Toaster />
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}

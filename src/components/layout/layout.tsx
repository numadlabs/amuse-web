import { ReactNode } from "react";
// import Header from "@/components/layout/header-comp";
import { Sora } from "next/font/google";
// import Sidebar from "@/components/layout/side-bar";
import { Toaster } from "../ui/sonner";
import BottomNavigation from "./bottom-navigation";

const sora = Sora({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = sora.className;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex flex-col w-full h-full bg-background min-h-screen items-center ${subClass}`}
    >
      {/* <Header /> */}
      <div className="w-full max-w-[1440px]">
        <div className="hidden lg:block">{/* <Sidebar /> */}</div>
        {children}
        <Toaster />
      </div>
    </div>
  );
}

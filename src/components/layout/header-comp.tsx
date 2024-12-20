import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bell } from "lucide-react";
import { User, Notification } from "iconsax-react";

import Logo from "../icons/logo";

interface HeaderProps {
  type?: "blank" | "default" | "page";
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ type = "default", title }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleBack = () => {
    router.back();
  };

  const renderContent = () => {
    switch (type) {
      case "blank":
        return null;
      case "page":
        return (
          <>
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            <div className="w-10" /> {/* Spacer to maintain layout */}
          </>
        );
      default:
        return (
          <div className="max-w-[480px] z-50 flex h-12 w-full mx-auto items-center justify-between bg-background">
            <Link href="/profile" passHref className="p-4">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <Logo />
            </div>

            <Link href="/notifications" passHref className="p-4">
              <Button variant="ghost" size="icon">
                <Notification className="h-6 w-6" />
              </Button>
            </Link>
          </div>
        );
    }
  };

  if (type === "blank") {
    return null;
  }

  return (
    <header className="max-w-[480px] mx-auto flex justify-between items-center p-4 w-full top-0 left-0 right-0 fixed bg-background">
      {renderContent()}
    </header>
  );
};

export default Header;

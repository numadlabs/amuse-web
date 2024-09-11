import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Bell } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <header className="flex justify-between items-center p-4 w-full">
      {currentPath !== "/home" && (
        <Link href="/home" passHref>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
      )}
      <h1 className="text-xl font-semibold text-white">
        {currentPath === "/home"
          ? "Amuse Bouche BETA"
          : currentPath.slice(1).charAt(0).toUpperCase() + currentPath.slice(2)}
      </h1>
      <div className="flex gap-2">
        <Link href="/profile" passHref>
          <Button variant="ghost" size="icon">
            <User className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/notifications" passHref>
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;

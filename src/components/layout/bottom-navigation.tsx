import Link from "next/link";
import { Home2, Map, ScanBarcode, IconProps } from "iconsax-react";
import { useRouter } from "next/router";

interface BottomNavigationProps {
  type?: 'Modal' | 'default'
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ type = 'default' }) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const linkClass = (path: string) => `
    flex flex-col p-3 items-center justify-center gap-1 
    ${isActive(path) 
      ? 'text-gray50' 
      : 'text-gray100'
    }
    transition-colors focus:text-gray-900 
  `;

  const iconProps = (path: string): IconProps => ({
    size: 24,
    color: isActive(path) ? "#FFFFFF" : "#9AA2A7",
    variant: isActive(path) ? "Bold" : "Outline"
  });

  if (type === 'Modal') {
    return null;
  }

  return (
    <nav className="max-w-[480px] border-t border-gray400 mx-auto fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-center gap-11 bg-background shadow-t dark:shadow-t-gray-800">
      <Link
        href="/home"
        className={linkClass("/home")}
        prefetch={false}
      >
        <Home2 {...iconProps("/home")} />
        <span className="text-sm">Home</span>
      </Link>
      <Link
        href="/check-in"
        className="flex flex-col items-center relative bottom-5 justify-center text-gray100 transition-colors focus:text-gray-900 dark:text-gray-400 dark:focus:text-gray-50"
        prefetch={false}
      >
        <div className="p-4 bg-gray500 border border-gray400 rounded-full">
          <ScanBarcode className="h-8 w-8 text-white" variant={isActive("/check-in") ? "Bold" : "Outline"} />
        </div>
        <span className="text-sm mt-1 text-gray00">Check-in</span>
      </Link>
      <Link
        href="/discover"
        className={linkClass("/discover")}
        prefetch={false}
      >
        <Map {...iconProps("/discover")} />
        <span className="text-sm">Discover</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
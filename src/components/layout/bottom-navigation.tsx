/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DPauvtLudTe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Home2, Map, ScanBarcode } from "iconsax-react";

export default function BottomNavigation() {
  return (
    <nav className="max-w-[600px] mx-auto fixed bottom-0 left-0 right-0 z-50 flex h-14 w-full items-center justify-around bg-gray600 shadow-t dark:bg-gray-900 dark:shadow-t-gray-800">
      <Link
        href="/home"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
        prefetch={false}
      >
        <Home2 className="h-6 w-6" />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/check-in"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
        prefetch={false}
      >
        <ScanBarcode className="h-6 w-6" />
        <span className="text-xs">Check-in</span>
      </Link>
      <Link
        href="/restaurants"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
        prefetch={false}
      >
        <Map className="h-6 w-6" />
        <span className="text-xs">Discover</span>
      </Link>
    </nav>
  );
}

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DPauvtLudTe
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Home2, Map, ScanBarcode } from "iconsax-react";

export default function BottomNavigation() {
  return (
    <nav className="max-w-[600px] border-t border-gray400 mx-auto fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-center gap-11 bg-background shadow-t dark:shadow-t-gray-800">
      <Link
        href="/home"
        className="flex flex-col p-3 items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray50 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
        prefetch={false}
      >
        <Home2 className="h-6 w-6" />
        <span className="text-sm">Home</span>
      </Link>
      <Link
        href="/check-in"
        className="flex flex-col items-center relative bottom-5 justify-center text-gray-500 transition-colors hover:text-gray50 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
        prefetch={false}
      >
          <div className="p-4 bg-gray500 border border-gray400 rounded-full">
            <ScanBarcode className="h-8 w-8 text-white" />
          </div>
          <span className=" text-sm mt-1">Check-in</span>
      </Link>
      <Link
<<<<<<< Updated upstream
        href="/discover"
        className="flex flex-col items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray-900 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
=======
        href="/restaurants"
        className="flex flex-col p-3 w-16 items-center justify-center gap-1 text-gray-500 transition-colors hover:text-gray50 focus:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 dark:focus:text-gray-50"
>>>>>>> Stashed changes
        prefetch={false}
      >
        <Map className="h-6 w-6" />
        <span className="text-sm">Discover</span>
      </Link>
    </nav>
  );
}

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Check, LogoutCurve, Notification, ScanBarcode } from "iconsax-react";
import ScanQrModal from "../(modals)/scan-qr-modal";
import BalanceDropdown from "../ui/dropdown/balance-dropdown";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import { ROLES } from "@/lib/enums";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getUnreadNotification } from "@/lib/service/queryHelper";
import NotificationItem from "../atom/notication-item";
import { useAuth } from "@/lib/context/auth-context";
import { restaurantKeys } from "@/lib/service/keysHelper";

const Header = () => {
  const { onLogout } = useAuth();
  const { data: session } = useSession();
  const { data } = useEmployeeProfile(session?.userId);
  const [showQrModal, setShowQrModal] = useState(false);
  const { data: notification = [], isLoading } = useQuery({
    queryKey: [restaurantKeys.notification],
    queryFn: getUnreadNotification,
  });

  const toggleQrModal = () => {
    setShowQrModal(!showQrModal);
  };
  const signOut = async () => {
    if (onLogout) {
      const result = await onLogout();
    }
  };

  return (
    <>
      <div className="fixed z-20 flex w-screen border-b lg:justify-between bg-background border-1 border-gray500">
        <div className="flex justify-around w-full py-4 lg:w-screen lg:flex lg:flex-row lg:items-center lg:justify-between px-7">
          <Link href={"/dashboard"}>
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={215}
              height={48}
              className="cursor-pointer w-[185px]  md:pl-0 md:w-[215px]"
            />
          </Link>
          <div className="hidden lg:block">
            <div className="flex flex-row justify-end w-full gap-3">
              {data?.role !== ROLES.RESTAURANT_WAITER && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="tertiary" size="lg" className="w-12">
                        <span>
                          <Notification size={24} color="#FFFFFF" />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      <DropdownMenuGroup>
                        <div className="absolute max-w-[540px] w-screen mt-6 border border-gray400 bg-gradient-to-b from-gray500 to-transparent rounded-3xl backdrop-blur-3xl">
                          <div className="flex flex-col w-full">
                            <div className="flex flex-row items-center justify-between p-6">
                              <p className="text-xl font-bold text-gray00">
                                Nofication
                              </p>
                              <Button
                                variant="tertiary"
                                className="flex flex-row items-center gap-2"
                              >
                                <Check size={16} color="#ffffff" />
                                Mark all as read
                              </Button>
                            </div>
                            <div className="h-[1px] w-full bg-gray400" />
                            {notification && notification.length > 0 ? (
                              <div className="max-h-[540px] h-screen">
                                <div className="flex flex-col gap-3 overflow-auto h-[98%] p-3">
                                  {notification.map((item: any) => (
                                    <NotificationItem
                                      key={item.id}
                                      isRead={item.isRead}
                                      message={item.message}
                                      createdAt={item.createdAt}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-6 p-12">
                                <div className="flex items-center justify-center bg-gray400 h-14 w-14 rounded-xl">
                                  <Notification size={32} color="#ffffff" />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                  <p className="text-lg font-semibold text-gray00">
                                    No notification yet
                                  </p>
                                  <p className="text-sm text-gray50">
                                    We will notify you when something arrives.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <BalanceDropdown />
                </>
              )}
              <Button
                variant={"secondary"}
                size={"lg"}
                onClick={toggleQrModal}
                className="w-36 text-sm ml-[65px] md:ml-0 md:w-40 md:text-lg"
              >
                <div className="flex flex-row items-center gap-2">
                  <ScanBarcode size={24} />
                  Scan QR
                </div>
              </Button>
            </div>
          </div>
          <div className="block lg:hidden">
            <Button
              variant={"secondary"}
              size={"lg"}
              onClick={signOut}
              className="text-sm sm:w-56 md:w-64 lg:text-lg"
            >
              <div className="flex flex-row items-center justify-center gap-2">
                <LogoutCurve size="16" color="#ffffff" />
                Log out
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative block h-screen lg:hidden">
        <div className="fixed bottom-8 right-8 sm:bottom-8 sm:right-8">
          <Button
            variant={"secondary"}
            size={"lg"}
            onClick={toggleQrModal}
            className="text-sm sm:w-56 md:w-64 lg:text-lg"
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <ScanBarcode size={24} />
              Scan QR
            </div>
          </Button>
        </div>
      </div>

      {showQrModal && (
        <ScanQrModal show={showQrModal} handleClose={toggleQrModal} />
      )}
    </>
  );
};

export default Header;

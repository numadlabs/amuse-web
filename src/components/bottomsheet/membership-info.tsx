import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";

interface drawerProps {
  open: boolean;
  onClose: () => void;
}

const MembershipInfo: React.FC<drawerProps> = ({ open, onClose }) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerClose onClick={onClose}>
        <DrawerContent className="bg-gray600 outline-0 outline-none rounded-t-[32px] max-w-[480px] w-full mx-auto">
          <div className="w-full px-4 pt-4 pb-12 flex flex-col gap-6 items-center">
            <DrawerHeader className="flex relative justify-center w-full">
              <DrawerTitle className="py-2 text-xl text-gray00 font-bold">
                Membership
              </DrawerTitle>
              <div className="absolute top-1 right-1">
                <DrawerClose className="bg-gray400 h-8 w-8 rounded-[48px] flex justify-center items-center hover:opacity-75 transition-all duration-200 ease-out">
                  <X size={16} color="#FFFFFF" />
                </DrawerClose>
              </div>
            </DrawerHeader>
            <Image
              src={"/images/membership.png"}
              alt="alys"
              width={215}
              height={166}
            />
            <div className="w-full">
              <p className="text-md text-gray50 text-center">
                Earn Bitcoin and other rewards simply by using our membership
                cards when you visit your favorite restaurants.
              </p>
            </div>
            <DrawerFooter className="w-full">
              <Button size={"lg"} variant={"primary"} onClick={onClose}>
                Got it
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </DrawerClose>
    </Drawer>
  );
};

export default MembershipInfo;

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

const PerkInfo: React.FC<drawerProps> = ({ open, onClose }) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerClose onClick={onClose}>
        <DrawerContent className="bg-gray600 outline-0 outline-none rounded-t-[32px]">
          <div className="w-full px-4 pt-4 pb-12 flex flex-col gap-6 items-center">
            <DrawerHeader className="flex relative justify-center w-full">
              <DrawerTitle className="py-2 text-xl text-gray00 font-bold">
                Perk
              </DrawerTitle>
              <div className="absolute top-1 right-1">
                <DrawerClose className="bg-gray400 h-8 w-8 rounded-[48px] flex justify-center items-center hover:opacity-75 transition-all duration-200 ease-out">
                  <X size={16} color="#FFFFFF" />
                </DrawerClose>
              </div>
            </DrawerHeader>
            <Image
              src={"/images/perk-info.png"}
              alt="alys"
              width={311}
              height={58}
            />
            <div className="w-full">
              <p className="text-md text-gray50 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sed justo ac urna fringilla rhoncus.
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

export default PerkInfo;

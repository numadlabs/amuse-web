import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import APassStripes from "@/components/icons/apass-stripes";

const MembershipCard = () => {
  return (
    <Card className="relative w-[343px] h-[264px] overflow-hidden bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] flex items-center">
      <div className="flex flex-col gap-5 items-start p-5 z-50 w-full">
        <div className="flex justify-start gap-5">
          <div>
            {" "}
            <Image
              src={"/images/LogoDark.png"}
              alt="image"
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Choijin temple</h1>
            <h2 className="uppercase font-normal text-sm text-gray50">
              mongolia
            </h2>
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            {" "}
            <Image
              src={"/images/LogoDark.png"}
              alt="image"
              width={164}
              height={164}
              className="rounded-xl object-cover"
            />
          </div>
          <div className="w-[123px] h-[164px] rounded-xl bg-gray500 border border-gray400">
            <div className="flex flex-col justify-center items-center gap-1 h-[126px] border-b border-gray400">
              <h1 className="font-bold text-4xl text-white">00</h1>
              <h2 className="font-normal text-sm text-gray50">Check-ins</h2>
            </div>
            <div className="flex justify-center items-center gap-[6px] pt-2 pb-3">
              <h1 className="font-bold text-md text-white">10</h1>
              <h2 className="font-normal text-sm text-gray50">Until a perk</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute z-10 -right-28 opacity-80">
        <APassStripes />
      </div>
    </Card>
  );
};

export default MembershipCard;

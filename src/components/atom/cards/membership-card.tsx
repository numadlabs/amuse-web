import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import APassStripes from "@/components/icons/apass-stripes";
import SERVER_SETTINGS from "@/lib/serverSettings";
import { RestaurantType } from "@/lib/types";

interface MembershipProps {
  name: string;
  nftImage: string;
  category: string;
  visitCount: number;
  target: number | undefined;
  logo: string;
}

const MembershipCard: React.FC<MembershipProps> = ({
  name,
  nftImage,
  category,
  visitCount,
  target,
  logo,
}) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] flex items-center">
      <div className="flex flex-col gap-5 items-start p-5 z-50 w-full">
        <div className="flex justify-start gap-5">
          <div>
            <Image
              src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${logo}`}
              alt="image"
              width={40}
              height={40}
              className="rounded-xl w-full max-h-[300px] object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">{name}</h1>
            <h2 className="uppercase font-normal text-sm text-gray50">
              {category}
            </h2>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="flex-grow">
            <Image
              src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${nftImage}`}
              alt={`${nftImage} NFT`}
              width={1000}
              height={1000}
              className="rounded-xl w-full max-h-[300px] object-cover"
            />
          </div>
          <div className="min-w-[100px] max-h-full rounded-xl bg-gray500 border border-gray400 flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-1 h-full border-b border-gray400">
              <h1 className="font-bold text-4xl text-white">
                {visitCount < 10 ? `0${visitCount}` : visitCount}
              </h1>
              <h2 className="font-normal text-sm text-gray50">Check-ins</h2>
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

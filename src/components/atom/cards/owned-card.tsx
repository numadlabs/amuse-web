import React from "react";
import Image from "next/image";
import { RestaurantType } from "@/lib/types";
import { Reserve } from "iconsax-react";
import SERVER_SETTINGS from "@/lib/serverSettings";

interface OwnedAcardsProp {
  marker: RestaurantType;
  onPress: () => void;
}

const OwnedAcards: React.FC<OwnedAcardsProp> = ({ marker, onPress }) => {

  const opensAt = new Date(marker.opensAt);
  const closesAt = new Date(marker.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt.getTime() &&
    currentTime.getTime() <= closesAt.getTime();

    console.log(opensAt)
  return (
    <div
      className="p-3 bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] w-full cursor-pointer"
      onClick={onPress}
    >
      <div className="flex flex-row gap-4">
        <Image
          src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${marker?.logo}`}
          alt={marker?.name}
          width={92}
          height={92}
          className="rounded-xl object-cover"
        />
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-gray-100 font-semibold text-lg">
              {marker?.name}
            </p>
            <p className="text-gray-200 uppercase text-sm">
              {marker?.categoryName}
            </p>
          </div>
          <div className={`flex flex-row items-center gap-3`}>
            <div className="flex flex-row gap-1.5 items-center">
              <div
                className={`w-2 h-2 m-1 rounded-full ${
                  isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-300">
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <div className="w-[1px] h-4 bg-gray-400" />
              <div className="flex flex-row gap-1.5 items-center">
                <Reserve size={16} color="#D7DADC" />
                <span className="text-gray-300 text-sm">
                  {marker?.visitCount} Check-ins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnedAcards;

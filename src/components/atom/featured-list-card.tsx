import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reserve } from "iconsax-react";
import { RestaurantType } from "@/lib/types";
import SERVER_SETTINGS from "@/lib/serverSettings";

interface FeaturedListCardProps {
  restaurant: RestaurantType;
  onClick: (restaurant: RestaurantType) => void;
}

const FeaturedListCard: React.FC<FeaturedListCardProps> = ({
  restaurant,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick(restaurant);
  };

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick(restaurant);
  };

  return (
    <div
      className="p-3 bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] w-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-row gap-4">
        <Image
          src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${restaurant?.logo}`}
          alt={restaurant?.name}
          width={92}
          height={92}
          className="rounded-xl object-cover"
        />
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-1 mt-1 w-[80%] xs:w-full">
            <p className="text-gray-100 font-semibold text-lg truncate">
              {restaurant?.name}
            </p>
            <p className="text-gray-200 uppercase text-sm truncate">
              {restaurant?.categoryName}
            </p>
          </div>
          <div
            className={`flex flex-row items-center ${
              restaurant?.isOwned ? "gap-3" : "justify-between"
            }`}
          >
            <div className="flex flex-row gap-1.5 items-center">
              <div
                className={`w-2 h-2 m-1 rounded-full ${
                  restaurant?.isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm text-gray-300">
                {restaurant?.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            {restaurant?.isOwned ? (
              <div className="flex flex-row items-center gap-3">
                <div className="w-[1px] h-4 bg-gray-400" />
                <div className="flex flex-row gap-1.5 items-center">
                  <Reserve size={16} color="#D7DADC" />
                  <span className="text-gray-300 text-sm">
                    {restaurant?.visitCount} Check-ins
                  </span>
                </div>
              </div>
            ) : (
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleAddClick}
                className="w-[72px] border-gray-100"
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedListCard;

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Reserve } from "iconsax-react";

// Assuming you have a types file
import { RestaurantType } from "@/lib/types";

// You might need to adjust this import based on your project structure
import SERVER_SETTINGS from "@/lib/serverSettings";
import { useRouter } from "next/router";
interface HomeRestListProps {
  restaurant: RestaurantType;
  onClick: () => void;
}

const FeaturedListCard: React.FC<HomeRestListProps> = ({
  restaurant,
  onClick,
}) => {
  const router = useRouter();
  const opensAt = new Date(restaurant?.opensAt);
  const closesAt = new Date(restaurant?.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt?.getTime() &&
    currentTime.getTime() <= closesAt?.getTime();
  const handleAddClick = () => {
    router.push("/restaurants"); // Replace with your actual restaurants page path
  };

  return (
    <div className="p-3 bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] w-full">
      <div className="flex flex-row gap-4">
        <Image
          src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${restaurant?.logo}`}
          alt={restaurant?.name}
          width={92}
          height={92}
          className="rounded-xl object-cover"
        />
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-gray00 font-semibold text-lg">
              {restaurant?.name}
            </p>
            <p className="text-gray100 uppercase text-sm">
              {restaurant?.categoryName}
            </p>
          </div>
          <div
            className={`flex items-center ${
              isOpen ? "gap-3" : "justify-between"
            }`}
          >
            <div className="flex flex-row gap-1.5 items-center mb-1">
              <span
                className={`w-2 h-2 rounded-full m-2 ${
                  isOpen ? "bg-red-500" : "bg-green-500"
                }`}
              />
              <span className="text-sm text-gray50">
                {isOpen ? "Closed" : "Open"}
              </span>
            </div>
            {restaurant?.isOwned ? (
              <div className="flex flex-row items-center gap-3">
                <div className="w-[1px] h-4 bg-gray400" />
                <div className="flex flex-row gap-1.5">
                  <Reserve size={16} color="#D7DADC" />
                  <span className="text-gray50 text-sm">
                    {restaurant?.visitCount} Check-ins
                  </span>
                </div>
              </div>
            ) : (
              <Button
                variant="tertiary"
                size="sm"
                onClick={onClick}
                className="w-[72px] border-gray000"
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

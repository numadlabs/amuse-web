import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Assuming you have a types file
import { RestaurantType } from "@/lib/types";

// You might need to adjust this import based on your project structure
import SERVER_SETTINGS from "@/lib/serverSettings";
// import { SERVER_SETTING } from "@/constants/serverSettings";

interface HomeRestListProps {
  restaurant: RestaurantType;
  onClick: () => void;
}

const FeaturedListCard: React.FC<HomeRestListProps> = ({
  restaurant,
  onClick,
}) => {
  const opensAt = new Date(restaurant?.opensAt);
  const closesAt = new Date(restaurant?.closesAt);
  const currentTime = new Date();

  const isOpen =
    currentTime.getTime() >= opensAt?.getTime() &&
    currentTime.getTime() <= closesAt?.getTime();

  return (
    <Card className="w-full mb-4 overflow-hidden rounded-xl border border-gray-400">
      <CardContent className="p-3 bg-gradient-to-br from-brand-card-start to-brand-card-end">
        <div className="flex gap-4">
          <Image
            src={`${SERVER_SETTINGS.IMAGE_CDN}/${restaurant?.logo}`}
            alt={restaurant?.name}
            width={92}
            height={92}
            className="rounded-xl object-cover"
          />
          <div className="flex flex-col justify-between flex-grow">
            <div>
              <h3 className="text-white font-bold truncate">
                {restaurant?.name}
              </h3>
              <p className="text-gray-100 uppercase text-sm">
                {restaurant?.categoryName}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`w-2.5 h-2.5 rounded-full mr-1.5 ${
                    isOpen ? "bg-red-500" : "bg-green-500"
                  }`}
                />
                <span className={isOpen ? "text-red-500" : "text-green-500"}>
                  {isOpen ? "Closed" : "Open"}
                </span>
              </div>
              {restaurant?.isOwned ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-px h-3.5 bg-gray-50" />
                  <Check className="text-gray-50 w-4 h-4" />
                  <span className="text-gray-50">
                    {restaurant?.visitCount} Check-ins
                  </span>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClick}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedListCard;

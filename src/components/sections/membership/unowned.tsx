import { Location } from "iconsax-react";
import { Check } from "lucide-react";
import React from "react";
import { RestaurantType } from "@/lib/types";

interface ownedProps {
  restaurant: RestaurantType;
}

const UnOwned: React.FC<ownedProps> = ({ restaurant }) => {
  return (
    <>
      <section className="flex flex-col gap-4 justify-center mt-6">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="font-bold text-lg text-white">Rewards</h1>
          <div className="flex gap-3">
            <Check color={"#ffff"} size={20} />
            <h2 className="font-normal text-lg text-gray50">
              {restaurant?.benefits}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-lg text-white">Locations</h1>
          <div className="flex gap-3">
            <Location color="#ffffff" size={20} />
            <h2 className="font-normal text-lg text-systemInformation">
            {restaurant?.location}
            </h2>
          </div>
        </div>
        <div className="grid gap-4">
          <h1 className="font-bold text-lg text-white">About</h1>
          <div className="flex gap-3">
            <h2 className="font-normal text-lg text-gray50">
              {restaurant?.description}
            </h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <h1 className="font-bold text-lg text-white">How it works</h1>
          <div className="flex gap-3">
            <h2 className="font-normal text-lg text-gray50">
              {restaurant?.instruction}
            </h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default UnOwned;

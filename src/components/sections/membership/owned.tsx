import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Location } from "iconsax-react";
import { Check } from "lucide-react";
import { RestaurantType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getPerksByRestaurant, getTimeTable } from "@/lib/service/queryHelper";

interface ownedProps {
  restaurant: RestaurantType;
  onClick: () => void;
  cardId: string;
  marker: boolean;
}

const Owned: React.FC<ownedProps> = ({ restaurant, onClick }) => {
  const { data: timeTable } = useQuery({
    queryKey: ["RestaurantTimeTable"],
    queryFn: () => getTimeTable(restaurant?.id as string),
    enabled: !!restaurant?.id,
  });

  const { data: perks = [] } = useQuery({
    queryKey: ["perkKey", restaurant?.id as string],
    queryFn: () => getPerksByRestaurant(restaurant?.id as string),
    enabled: !!restaurant?.id,
  });

  const hasPerks =
    perks && (perks.userBonuses?.length > 0 || perks.followingBonus);

  const getDayName = (dayNo: number) => {
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return daysOfWeek[dayNo - 1]; // dayNo is 1-based
  };

  return (
    <div className="flex flex-col gap-6 mt-4 mb-12">
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
        <div className="w-full bg-background text-white rounded-lg">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="timetable">
              <AccordionTrigger className="flex justify-between items-center relative">
                <span className="font-bold text-lg text-white">Timetable</span>
                <div className="flex items-center gap-[6px] absolute right-8">
                  <span
                    className={`relative w-2 h-2 p-1 rounded-full ${
                      restaurant?.isOpen ? "bg-systemSuccess" : "bg-systemError"
                    }`}
                  ></span>
                  <span className="text-gray50 font-normal">
                    {restaurant?.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-3 mt-6">
                  {timeTable?.map((item: any) => (
                    <div className="flex flex-col gap-3" key={item.id}>
                      <div className="flex flex-row justify-between items-center">
                        <span className="text-gray100 text-md">
                          {getDayName(item.dayNoOfTheWeek)}
                        </span>
                        {item.isOffDay ? (
                          <span className="text-gray50 text-md">-</span>
                        ) : (
                          <span className="text-gray50 text-md max-w-[100px] w-screen text-end">
                            {item.opensAt}-{item.closesAt}
                          </span>
                        )}
                      </div>
                      <div className="h-[1px] w-full bg-gray400" />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
    </div>
  );
};

export default Owned;

import React from "react";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Location, InfoCircle, Add, TicketStar } from "iconsax-react";
import { Button } from "@/components/ui/button";
import PerkIcon from "@/components/icons/perk-icon";
import { Check } from "lucide-react";
import { RestaurantType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getPerksByRestaurant, getTimeTable } from "@/lib/service/queryHelper";
import PowerUpCard from "@/components/atom/cards/powerUp-card";

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
    <Tabs defaultValue="perks" className="flex flex-col gap-6 mt-4 mb-12">
      <TabsList className="grid grid-cols-2 bg-gray500 rounded-3xl p-1">
        <TabsTrigger
          value="perks"
          className="data-[state=active]:bg-gray400 rounded-[48px] text-gray00 h-10"
        >
          Perks
        </TabsTrigger>
        <TabsTrigger
          value="details"
          className="data-[state=active]:bg-gray400 rounded-[48px] text-gray00 h-10"
        >
          Details
        </TabsTrigger>
      </TabsList>
      <TabsContent value="perks">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between px-2">
            <p className="text-lg text-gray00 font-bold">Perks</p>
            <button onClick={onClick}>
              <InfoCircle size={20} color="#D7DADC" />
            </button>
          </div>
          {hasPerks ? (
            <>
              {perks?.userBonuses?.map((item: any, index: any) => (
                <PowerUpCard key={index} title={item.title} />
              ))}
              {perks?.followingBonus && (
                <div className="flex flex-row justify-between items-center border-dashed border border-gray400 rounded-2xl py-4 px-5">
                  <div className="flex flex-row gap-3 items-center">
                    <TicketStar size={24} color="#D7DADC" />
                    <p className="text-md font-semibold text-gray00">asdfsad</p>
                  </div>
                  <div className="text-gray00 text-md font-semibold">
                    {perks?.followingBonus?.current}/
                    {perks?.followingBonus?.target}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="border border-gray400 rounded-2xl flex flex-col gap-4 justify-center items-center px-6 py-8 bg-gradient-to-b from-gray500 to-transparent">
              <div className="w-14 h-14 bg-gray400 justify-center items-center flex rounded-xl">
                <PerkIcon size={32} />
              </div>
              <p className="text-sm text-gray50 text-center">
                You do not have any perks yet. <br />
                Check-in to unlock some, or redeem others with <br />
                your Bitcoin balance.
              </p>
            </div>
          )}
          <Button
            variant={"secondary"}
            size={"lg"}
            className="flex flex-row gap-3 items-center"
          >
            <span>
              <Add size={24} color="#FFFFFF" />
            </span>
            Add Perk
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="details">
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
                <AccordionTrigger className="flex justify-between items-center">
                  <span className="font-bold text-lg text-white">
                    Timetable
                  </span>
                  <div className="flex items-center relative left-24 gap-[6px]">
                    <span
                      className={`relative w-2 h-2 p-1 rounded-full ${
                        restaurant?.isOpen
                          ? "bg-systemSuccess"
                          : "bg-systemError"
                      }`}
                    ></span>
                    <span className="text-gray50 font-normal">
                      {restaurant?.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {timeTable?.map((item: any) => (
                      <div className="flex flex-col gap-3" key={item.id}>
                        <div className="flex flex-row justify-between items-center">
                          <span className="text-gray100 text-md">
                            {getDayName(item.dayNoOfTheWeek)}
                          </span>
                          {item.isOffDay ? (
                            <span className="text-gray50 text-md">-</span>
                          ) : (
                            <span className="text-gray50 text-md">
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
      </TabsContent>
    </Tabs>
  );
};

export default Owned;

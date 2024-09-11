import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import MembershipCard from "@/components/atom/cards/membership-card";
import UnOwned from "@/components/sections/membership/unowned";
import Owned from "@/components/sections/membership/owned";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/lib/service/queryHelper";
import moment from "moment";
import { useRouter } from "next/router";

const Restaurants = () => {
  const router = useRouter();
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();
  const { data: restaurantsData } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () =>
      getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      }),
    enabled: true,
  });

  const handlePreviousClick = () => {
    router.back();
  };

  return (
    <>
      <div className="bg-background h-screen w-full flex flex-col items-center">
        <ScrollArea className="flex flex-col items-start max-w-[343px] w-screen">
          <div className="mb-4 py-1 flex w-full justify-end">
            <button
              className="flex bg-gray400 justify-center items-center h-12 w-12 rounded-full"
              onClick={handlePreviousClick}
            >
              <X size={24} color="#FFFFFF" />
            </button>
          </div>
          <MembershipCard />
          <>{restaurantsData?.isOwned ? <UnOwned /> : <Owned />}</>
        </ScrollArea>
      </div>
    </>
  );
};

export default Restaurants;

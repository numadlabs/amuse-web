import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import MembershipCard from "@/components/atom/cards/membership-card";
import UnOwned from "@/components/sections/membership/unowned";
import Owned from "@/components/sections/membership/owned";
import { useQuery } from "@tanstack/react-query";
import {
  getRestaurantById,
  getPerksByRestaurant,
} from "@/lib/service/queryHelper";
import moment from "moment";
import { useRouter } from "next/router";

const Restaurants = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();
  const calculateTarget = (
    perkOccurence?: number,
    followingBonusCurrent?: number
  ): number | undefined => {
    if (perkOccurence === undefined || followingBonusCurrent === undefined) {
      return undefined;
    }
    return perkOccurence - followingBonusCurrent;
  };
  const {
    data: restaurantData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurantData", id, currentTime, currentDayOfWeek],
    queryFn: () =>
      getRestaurantById({
        id: id as string,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      }),
    enabled: !!id,
  });

  const { data: perks } = useQuery({
    queryKey: ["perkKey"],
    queryFn: () => getPerksByRestaurant(id as string),
    enabled: !!id,
  });

  const hasPerks =
    perks && (perks.userBonuses?.length > 0 || perks.followingBonus);

  const handlePreviousClick = () => {
    router.back();
  };

  return (
    <>
      <div className="bg-background h-screen w-full flex flex-col items-center">
        <ScrollArea className="flex flex-col items-start max-w-[343px] w-screen">
          <div className="mb-4 py-1 flex w-full justify-end mt-12">
            <button
              className="flex bg-gray400 justify-center items-center h-12 w-12 rounded-full"
              onClick={handlePreviousClick}
            >
              <X size={24} color="#FFFFFF" />
            </button>
          </div>
          <MembershipCard
            key={restaurantData?.id}
            name={restaurantData?.name}
            logo={restaurantData?.logo}
            nftImage={restaurantData?.nftImageUrl}
            category={restaurantData?.category}
            visitCount={restaurantData?.rewardAmount}
            target={calculateTarget(
              restaurantData?.perkOccurence,
              perks?.followingBonus?.current
            )}
          />
          <>
            {restaurantData?.isOwned ? (
              <Owned restaurant={restaurantData} />
            ) : (
              <UnOwned restaurant={restaurantData} />
            )}
          </>
        </ScrollArea>
      </div>
    </>
  );
};

export default Restaurants;

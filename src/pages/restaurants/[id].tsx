import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import MembershipCard from "@/components/atom/cards/membership-card";
import UnOwned from "@/components/sections/membership/unowned";
import Owned from "@/components/sections/membership/owned";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurantById,
  getPerksByRestaurant,
} from "@/lib/service/queryHelper";
import moment from "moment";
import { useRouter } from "next/router";
import PerkInfo from "@/components/bottomsheet/perk-info";
import AuthenticatedLayout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { WalletAdd1 } from "iconsax-react";
import { getAcard } from "@/lib/service/mutationHelper";
import { useSession } from "next-auth/react";

const Restaurants = () => {
  const [isDrawer, setIsDrawer] = useState(false);
  const [perkId, setPerkId] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: session } = useSession();
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
    queryKey: ["perkKey", id],
    queryFn: () => getPerksByRestaurant(id as string),
    enabled: !!id,
  });

  const toggleDrawer = () => {
    setIsDrawer(!isDrawer);
  };

  const handlePreviousClick = () => {
    router.back();
  };

  const { mutateAsync: createGetAcardMutation } = useMutation({
    mutationFn: getAcard,
    onError: (error) => console.log(error),
    onSuccess: (data) => {
      if (data.data.success) {
        setPerkId(data.data.data.userCard.cardId);
        queryClient.invalidateQueries({ queryKey: ["restaurants"] });
        queryClient.invalidateQueries({ queryKey: ["userCards"] });
      }
    },
  });

  const handleGetAcard = async () => {
    if (session?.userId) {
      await createGetAcardMutation(restaurantData?.cardId).then((response) => {
        console.log(response);
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="flex w-full items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center max-w-[480px] w-full justify-start relative h-full">
          <div className="sticky top-0 z-10 w-full mb-4 mt-16">
            <div className="flex justify-end">
              <button
                className="flex bg-gray400 justify-center items-center h-12 w-12 rounded-full"
                onClick={handlePreviousClick}
              >
                <X size={24} color="#FFFFFF" />
              </button>
            </div>
          </div>
          <ScrollArea className="w-full h-[calc(100vh-12rem)]">
            <div className="space-y-4 mb-36">
              <MembershipCard
                key={restaurantData?.id}
                name={restaurantData?.name}
                logo={restaurantData?.logo}
                nftImage={restaurantData?.nftImageUrl}
                category={restaurantData?.category}
                visitCount={restaurantData?.visitcount || 0}
                target={calculateTarget(
                  restaurantData?.perkOccurence,
                  perks?.followingBonus?.current
                )}
              />
              {restaurantData?.isOwned ? (
                <Owned
                  restaurant={restaurantData}
                  onClick={toggleDrawer}
                  cardId={perkId}
                  marker={restaurantData?.isOwned}
                />
              ) : (
                <UnOwned restaurant={restaurantData} />
              )}
            </div>
          </ScrollArea> 
          {!restaurantData?.isOwned && (
            <div className="sticky bottom-20 z-20 w-full">
              <button
                className="w-full flex flex-row gap-3 bg-gray400 h-12 justify-center items-center rounded-[48px]"
                onClick={handleGetAcard}
              >
                <span>
                  <WalletAdd1 size={24} color="#FFFFFF" />
                </span>
                <span className="text-lg text-gray00 font-semibold">
                Add membership
                </span>
              </button>
            </div>
          )}
          <PerkInfo onClose={toggleDrawer} open={isDrawer} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Restaurants;

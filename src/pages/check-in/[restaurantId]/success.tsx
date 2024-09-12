import React from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRestaurantId } from "@/lib/service/queryHelper";
import { restaurantKeys, userKeys } from "@/lib/service/keysHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { PowerUpCard } from "@/components/atom/cards/PowerUpCard";
import moment from "moment";
import AuthenticatedLayout from "@/components/layout/layout";

export default function Success() {
  const router = useRouter();
  const { restaurantId, btcAmount } = router.query;

  const queryClient = useQueryClient();
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  const { data: card, isLoading } = useQuery({
    queryKey: [restaurantKeys.detail(restaurantId as string)],
    queryFn: () =>
      getRestaurantId(restaurantId as string, currentTime, currentDayOfWeek),
    enabled: !!restaurantId,
  });

  const handleNavigation = async () => {
    router.push("/home");
    queryClient.invalidateQueries({ queryKey: userKeys.info });
    queryClient.invalidateQueries({ queryKey: userKeys.cards });
    queryClient.invalidateQueries({ queryKey: userKeys.notifications });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout headerType="blank" bottomNavigationType="Modal">
      <Card className="bg-gradient-to-b from-brand-card-start to-brand-card-end text-white">
        <CardContent className="flex flex-col items-center justify-center h-48 space-y-2">
          <h2 className="text-2xl font-bold">
            +{Number(btcAmount).toFixed(2)} EUR of Bitcoin
          </h2>
          <p className="text-gray-200">Check-in successful.</p>
        </CardContent>
      </Card>

      {/* {powerUp && (
        <PowerUpCard
          title={powerUp as string}
          onPress={() => router.push("/PowerUp")}
        />
      )} */}

      <div className="fixed bottom-5 left-0 right-0 px-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleNavigation}
        >
          Confirm
        </Button>
      </div>
    </AuthenticatedLayout>
  );
}

import React from "react";
import AuthenticatedLayout from "@/components/layout/layout";
import FeaturedListCard from "@/components/atom/featured-list-card";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants, getUserCard } from "@/lib/service/queryHelper";
import { RestaurantType } from "@/lib/types";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import moment from "moment";

const Membership = () => {
  const router = useRouter();
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  const { data: restaurantsData, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () =>
      getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      }),
    enabled: true, // Replace with actual condition
  });

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant: any) => restaurant.isOwned
  );

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: "/restaurants",
      query: { id: restaurant?.id },
    });
  };

  return (
    <AuthenticatedLayout headerTitle="Memberships" headerType="page">
      <div className="flex justify-center">
        <ScrollArea className="flex flex-col pt-6 gap-6 max-w-[480px] w-full">
        {filteredRestaurantsArray.map((card: any) => (
            <FeaturedListCard
              key={card.id}
              restaurant={card}
              onClick={() => handleNavigation(card)}
            />
          ))}
        </ScrollArea>
      </div>
    </AuthenticatedLayout>
  );
};

export default Membership;

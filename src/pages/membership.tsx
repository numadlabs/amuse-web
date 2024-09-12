import React from "react";
import AuthenticatedLayout from "@/components/layout/layout";
import FeaturedListCard from "@/components/atom/featured-list-card";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/lib/service/queryHelper";
import { RestaurantType } from "@/lib/types";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";

const Membership = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  const {
    data: restaurantsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () =>
      getRestaurants({
        page: 1,
        limit: 10,
        time: currentTime,
        dayNoOfTheWeek: currentDayOfWeek,
      }),
  });

  const restaurants = restaurantsData?.data?.restaurants || [];

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
          {restaurants.map((restaurant: any) => (
            <FeaturedListCard
              key={restaurant.id as string}
              restaurant={restaurant}
              onClick={() => handleNavigation(restaurant)}
            />
          ))}
        </ScrollArea>
      </div>
    </AuthenticatedLayout>
  );
};

export default Membership;

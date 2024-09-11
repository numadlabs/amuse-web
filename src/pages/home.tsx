import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  getUserById,
  getUserCard,
  getRestaurants,
} from "@/lib/service/queryHelper";
import { useSession } from "next-auth/react";

import { RestaurantType } from "@/lib/types";
import Balance from "@/components/sections/balance";
import QuickInfo from "@/components/sections/quick-info";
import StackedCard from "@/components/sections/stacked-cards";
import FeaturedListCard from "@/components/atom/featured-list-card";
import BalanceInfo from "@/components/bottomsheet/balance-info";
import { InfoCircle, GooglePlay, Apple } from "iconsax-react";
import MembershipInfo from "@/components/bottomsheet/membership-info";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AuthenticatedLayout from "@/components/layout/layout";
import ImportIcon from "@/components/icons/import-icon";

export default function HomePage() {
  const router = useRouter();
  const [isQuickInfoVisible, setIsQuickInfoVisible] = useState(true);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showMembershipInfo, setShowMembershipInfo] = useState(false);
  const { data: session } = useSession();
  const id = session?.userId;

  const currentTime = moment().format("HH:mm:ss");
  const currentDayOfWeek = moment().isoWeekday();

  useEffect(() => {
    const loadSettings = async () => {
      setShowProfilePicture(
        localStorage.getItem("showProfilePicture") === "true"
      );
      setShowDateOfBirth(localStorage.getItem("showDateOfBirth") === "true");
      setShowArea(localStorage.getItem("showArea") === "true");
    };
    loadSettings();
  }, []);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById(id as string),
    enabled: !!session?.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: ["userCards"],
    queryFn: () => getUserCard(),
    enabled: true, // Replace with actual condition
  });

  const { data: restaurantsData } = useQuery({
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

  const handleNavigation = (restaurant: RestaurantType) => {
    router.push({
      pathname: "/restaurants",
      query: { id: restaurant?.id },
    });
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const toggleMembershipInfo = () => {
    setShowMembershipInfo(!showMembershipInfo);
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant: any) => !restaurant.isOwned
  );

  return (
    <AuthenticatedLayout>
      <div className=" flex justify-center">
        <div className="flex flex-col pt-6 gap-6 max-w-[480px] w-screen">
          <div className="flex flex-col gap-4">
            {user && (
              <Balance
                amount={user?.user?.balance}
                convertedAmount={user?.convertedBalance}
                currencyName="EUR"
                handleToggle={toggleInfo}
              />
            )}

            <div className="flex flex-col gap-3">
              <p className="text-gray100 text-md font-semibold">Featured</p>
              <Carousel className="w-full">
                <CarouselContent>
                  <CarouselItem className="basis-auto w-[90%]">
                    <div className="bg-gradient-to-b from-gray500 to-transparent h-full border border-gray400 rounded-[20px] p-4 flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3">
                        <div className="bg-gray400 flex justify-center items-center h-9 w-9 rounded-xl">
                          <ImportIcon />
                        </div>
                        <p className="text-md text-gray00 font-semibold">
                          Download Amuse Bouche app
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          size={"sm"}
                          variant={"tertiary"}
                          className="flex flex-row items-center gap-2"
                        >
                          <span>
                            <Apple size={16} color="#FFFFFF" />
                          </span>
                          App Store
                        </Button>
                        <Button
                          size={"sm"}
                          variant={"tertiary"}
                          className="flex flex-row items-center gap-2"
                        >
                          <span>
                            <GooglePlay size={16} color="#FFFFFF" />
                          </span>
                          Google Play
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  {user?.user?.dateOfBirth &&
                  user?.user?.location &&
                  showProfilePicture
                    ? null
                    : isQuickInfoVisible && (
                        <CarouselItem className="basis-auto w-[90%]">
                          <QuickInfo
                            onPress={() => setIsQuickInfoVisible(false)}
                            user={user?.user}
                          />
                        </CarouselItem>
                      )}
                  {filteredRestaurantsArray.map((restaurant: any) => (
                    <CarouselItem
                      key={restaurant.id}
                      className="basis-auto w-[90%]"
                    >
                      <FeaturedListCard
                        restaurant={restaurant}
                        onClick={() => handleNavigation(restaurant)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <p className="text-gray100 font-semibold text-md">Memberships</p>
              <button onClick={toggleMembershipInfo}>
                <InfoCircle size={18} color="#9AA2A7" />
              </button>
            </div>
            <StackedCard />
            {cards?.data?.cards.length > 0 && (
              <div className="flex justify-center mt-8 mb-36">
                <Button
                  variant={"secondary"}
                  onClick={() => router.push("/my-cards")}
                >
                  See all
                </Button>
              </div>
            )}
          </div>
        </div>
        <BalanceInfo open={showInfo} onClose={toggleInfo} />
        <MembershipInfo
          open={showMembershipInfo}
          onClose={toggleMembershipInfo}
        />
      </div>
    </AuthenticatedLayout>
  );
}

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getUserById,
  getUserCard,
  getRestaurants,
} from "@/lib/service/queryHelper";
import { useSession } from "next-auth/react";

import { RestaurantType } from "@/lib/types";

// You'll need to create these custom components
import Balance from "@/components/sections/balance";
import QuickInfo from "@/components/sections/quick-info";
// import QuickInfo from "@/components/QuickInfo";
import StackedCard from "@/components/sections/stacked-cards";
import FeaturedListCard from "@/components/atom/featured-list-card";
// import HomeRestList from "@/components/HomeRestList";
// import DiscoverFloatRestCard from "@/components/DiscoverFloatRestCard";

export default function HomePage() {
  const router = useRouter();
  const [isQuickInfoVisible, setIsQuickInfoVisible] = useState(true);
  const [showProfilePicture, setShowProfilePicture] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showArea, setShowArea] = useState(true);
  const { data: session } = useSession();

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
    queryFn: () => getUserById(session.userId),
    enabled: !!session?.userId,
  });

  const { data: cards = [] } = useQuery({
    queryKey: ["userCards"],
    queryFn: () =>
      getUserCard({
        latitude: 0, // Replace with actual location
        longitude: 0, // Replace with actual location
      }),
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
    router.push(`/restaurants/${restaurant.id}?cardId=${restaurant.cardId}`);
  };

  const restaurantsArray = restaurantsData?.data?.restaurants || [];
  const filteredRestaurantsArray = restaurantsArray.filter(
    (restaurant) => !restaurant.isOwned
  );

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      <ScrollArea className="h-[calc(100vh-2rem)]">
        {user && (
          <div
            onClick={() => router.push("/wallet")}
            className="cursor-pointer"
          >
            <Balance
              amount={user?.user?.balance}
              convertedAmount={user?.convertedBalance}
              currencyName="EUR"
            />
          </div>
        )}

        <div className="mt-4 space-y-4">
          <h2 className="text-gray-300 font-medium">Featured</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {user?.user?.dateOfBirth &&
            user?.user?.location &&
            showProfilePicture
              ? null
              : isQuickInfoVisible && (
                  <QuickInfo
                    onClose={() => setIsQuickInfoVisible(false)}
                    user={user?.user}
                  />
                )}

            {filteredRestaurantsArray.map((restaurant) => (
              <FeaturedListCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleNavigation(restaurant)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 mb-3 flex justify-between items-center">
          <h2 className="text-gray-300 font-medium">Memberships</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Membership</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/images/membership.png"
                  alt="Membership"
                  width={200}
                  height={166}
                />
                <p className="text-center text-gray-400">
                  Earn Bitcoin and other rewards simply by using our membership
                  cards when you visit your favorite restaurants.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <StackedCard />

        {cards?.data?.cards.length > 0 && (
          <div className="flex justify-center mt-8 mb-16">
            <Button onClick={() => router.push("/my-cards")}>See all</Button>
          </div>
        )}
      </ScrollArea>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="fixed bottom-4 right-4">
            About Balance
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>About your Balance</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/balanceInfo.png"
              alt="Balance Info"
              width={204}
              height={64}
            />
            <p className="text-center text-gray-400">
              You earned ALYS Bitcoin, which is faster and cheaper to use but
              still pegged 1:1 with mainchain Bitcoin. Use your balance to
              redeem perks at restaurants. Withdrawals to external crypto
              wallets coming soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

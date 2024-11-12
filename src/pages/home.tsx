import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { getUserById, getRestaurants } from "@/lib/service/queryHelper";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RestaurantType } from "@/lib/types";
import Balance from "@/components/sections/balance";
import StackedCard from "@/components/sections/stacked-cards";
import FeaturedListCard from "@/components/atom/featured-list-card";
import BalanceInfo from "@/components/bottomsheet/balance-info";
import { InfoCircle, GooglePlay, Apple } from "iconsax-react";
import MembershipInfo from "@/components/bottomsheet/membership-info";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AuthenticatedLayout from "@/components/layout/layout";
import ImportIcon from "@/components/icons/import-icon";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
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

  const isFilteredArrayEmpty = filteredRestaurantsArray.length === 0;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" color="#FFFFFF" size={48} />
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="flex justify-center ">
        <div className="flex flex-col pt-6 gap-6 max-w-[480px] w-full">
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
              <p className="font-semibold text-gray100 text-md">Featured</p>
              <Carousel className="w-full">
                <CarouselContent className="flex gap-4">
                  <CarouselItem>
                    <div className="w-full bg-gradient-to-b from-gray500 to-transparent h-full border border-gray400 rounded-[20px] p-4 flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3">
                        <div className="flex items-center justify-center bg-gray400 h-9 w-9 rounded-xl">
                          <ImportIcon />
                        </div>
                        <p className="font-semibold text-md text-gray00">
                          Download Lumi app
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {/* <Link
                          href="https://apps.apple.com/us/app/amuse-bouche/id6479389566"
                          target="_blank"
                          rel="noopener noreferrer"
                        > */}
                        <div className="relative cursor-not-allowed">
                          <Button
                            size={"sm"}
                            variant={"tertiary"}
                            className="w-full flex flex-row items-center gap-2"
                            disabled
                          >
                            <span>
                              <Apple size={16} color="#FFFFFF" />
                            </span>
                            <span className="hidden xs:block">App Store</span>
                          </Button>
                          <span className="absolute -top-3.5 -right-2 bg-yellow-500 text-[8px] font-bold text-black px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                        {/* </Link> */}
                        {/* <Link
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                        > */}
                        <div className="relative cursor-not-allowed">
                          <Button
                            size={"sm"}
                            variant={"tertiary"}
                            className="w-full flex flex-row items-center gap-2"
                            disabled
                          >
                            <span>
                              <GooglePlay size={16} color="#FFFFFF" />
                            </span>
                            <span className="hidden xs:block">Google Play</span>
                          </Button>
                          <span className="absolute -top-3.5 -right-2 bg-yellow-500 text-[8px] font-bold text-black px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                        {/* </Link> */}
                      </div>
                    </div>
                  </CarouselItem>
                  {filteredRestaurantsArray.map((restaurant: any) => (
                    <CarouselItem key={restaurant.id}>
                      <FeaturedListCard
                        key={restaurant?.id}
                        restaurant={restaurant}
                        onClick={() => handleNavigation(restaurant)}
                      />
                    </CarouselItem>
                  ))}
                  <CarouselItem>
                    <div className="w-full h-[116px] flex justify-between items-center border border-gray400 rounded-[20px] bg-gradient-to-br from-[#242E35] to-transparent overflow-hidden relative">
                      <div className="flex flex-col gap-1 pl-5 z-20">
                        <p className="text-md font-bold text-gray00">
                          Restaurant List Growing!
                        </p>
                        <p className="text-sm text-gray100">
                          More memberships coming soon
                        </p>
                      </div>
                      <div className="absolute w-[64px] xs:w-[88px] h-[76px] xs:h-[100px] self-end bottom-0 right-0 z-0">
                        <Image
                          src={"/images/bannerItem.png"}
                          alt="banner"
                          fill
                          sizes="100%"
                          style={{
                            objectFit: "cover",
                          }}
                          className="rounded-br-[20px]"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="w-full h-[116px] flex justify-between items-center border border-gray400 rounded-[20px] bg-gradient-to-br from-[#242E35] to-transparent overflow-hidden relative">
                      <div className="flex flex-col gap-1 pl-5 z-20">
                        <p className="text-md font-bold text-gray00">
                          Bitcoin Withdrawals: Soon!
                        </p>
                        <p className="text-sm text-gray100">
                          Bitcoin withdrawals are coming.
                          <br />
                          Stay tuned!
                        </p>
                      </div>
                      <div className="absolute w-[64px] xs:w-[88px] h-[76px] xs:h-[100px] self-end bottom-0 right-0 z-0">
                        <Image
                          src={"/images/bannerItem2.png"}
                          alt="banner"
                          fill
                          sizes="100%"
                          style={{
                            objectFit: "cover",
                          }}
                          className="rounded-br-[20px]"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
              <p className="font-semibold text-gray100 text-md">Memberships</p>
              <button onClick={toggleMembershipInfo}>
                <InfoCircle size={18} color="#D7DADC" />
              </button>
            </div>
            <StackedCard />
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

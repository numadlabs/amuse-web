import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserCard } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import Search from "../icons/search";

const StackedCard = () => {
  const [cardPositions, setCardPositions] = useState(-400);
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // Simulating getting current location
    setCurrentLocation({ latitude: 40.7128, longitude: -74.006 });
  }, []);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: userKeys.cards,
    queryFn: () => {
      return getUserCard({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    },
    enabled: !!currentLocation.latitude,
  });

  useEffect(() => {
    if (cards && cards.data && cards.data.cards) {
      setCardPositions(cards.data.cards.length * 1);
    }
  }, [cards]);

  const latestCards = cards?.data?.cards.slice(0, 5);

  const handleNavigation = (restaurant: any) => {
    router.push(`/restaurants/${restaurant.restaurantId}`);
  };

  return (
    <div className="relative pb-60">
      {cards?.data?.cards.length === 0 ? (
        <div className="bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px]">
          <div className="flex flex-col items-center justify-center p-8 gap-6">
            <div className="flex flex-col justify-center items-center gap-4">
            <Search />
            <p className="text-center text-gray50 text-sm">
            Discover restaurants, add membership cards, and earn rewards when you check-in!
            </p>
            </div>
            <Button
            variant={"secondary"}
              onClick={() => router.push("/Acards")}
            >
              Explore
            </Button>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {latestCards?.map((card: any, index: any) => (
            <motion.div
              key={index}
              initial={{ y: -400 }}
              animate={{ y: cardPositions }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute w-full"
              style={{
                zIndex: latestCards.length - index,
                top: `${index * 10}px`,
              }}
            >
              <Card
                className="w-full shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleNavigation(card)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{card.name}</h3>
                      <p className="text-sm text-gray-500">
                        {card.categoryName}
                      </p>
                    </div>
                    {card.hasBonus && (
                      <span className="bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                        Bonus
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">Visits: {card.visitCount}</p>
                    <p className="text-sm">
                      Remaining:{" "}
                      {card?.target - card?.current === 0
                        ? 0
                        : card?.target - card?.current}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default StackedCard;

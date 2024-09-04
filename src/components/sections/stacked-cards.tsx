import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserCard } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import { SearchIcon } from "lucide-react";

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

  const handleNavigation = (restaurant) => {
    router.push(`/restaurants/${restaurant.restaurantId}`);
  };

  return (
    <div className="relative pb-60">
      {cards?.data?.cards.length === 0 ? (
        <Card className="bg-gradient-to-br from-brand-card-start to-brand-card-end rounded-3xl mb-30">
          <CardContent className="flex flex-col items-center justify-center h-58 p-8 gap-3">
            <SearchIcon className="w-12 h-12 text-gray-50" />
            <p className="text-center text-gray-50 text-sm">
              Discover restaurants, add a membership card, and start earning
              rewards every time you check-in at a participating restaurant!
            </p>
            <Button
              onClick={() => router.push("/Acards")}
              className="mt-6 bg-gray-600 text-white rounded-full px-5 py-3"
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {latestCards?.map((card, index) => (
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

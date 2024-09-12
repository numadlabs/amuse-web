import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserCard } from "@/lib/service/queryHelper";
import { userKeys } from "@/lib/service/keysHelper";
import Search from "../icons/search";
import SERVER_SETTINGS from "@/lib/serverSettings";
import Image from "next/image";
import APassStripes from "../icons/apass-stripes";

const StackedCard = () => {
  const [cardPositions, setCardPositions] = useState(-400);
  const router = useRouter();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: userKeys.cards,
    queryFn: getUserCard,
  });

  useEffect(() => {
    if (cards?.data?.cards) {
      setCardPositions(cards.data.cards.length * 1);
    }
  }, [cards]);

  const latestCards = cards?.data?.cards?.slice(0, 5) || [];

  const handleNavigation = (card: any) => {
    router.push({
      pathname: "/restaurants",
      query: { id: card?.restaurantId },
    });
  };

  if (!cards?.data?.cards || cards.data.cards.length === 0) {
    return (
      <div className="bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px]">
        <div className="flex flex-col items-center justify-center p-8 gap-6">
          <div className="flex flex-col justify-center items-center gap-4">
            <Search />
            <p className="text-center text-gray50 text-sm">
              Discover restaurants, add membership cards, and earn rewards when
              you check-in!
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/discovery")}>
            Explore
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative"
        style={{ height: `${Math.max(latestCards.length * 10 + 300, 300)}px` }}
      >
        <AnimatePresence>
          {latestCards.map((card: any, index: number) => (
            <motion.div
              key={card.id}
              initial={{ y: -400 }}
              animate={{ y: cardPositions }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute w-full"
              style={{
                zIndex: latestCards.length - index,
                top: `${index * 10}px`,
              }}
              onClick={() => handleNavigation(card)}
            >
              <Card className="relative w-full overflow-hidden bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] flex items-center">
                <div className="flex flex-col gap-5 items-start p-5 z-20 w-full h-full">
                  <div className="flex justify-start items-center gap-5">
                    <Image
                      src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${card.logo}`}
                      alt={card.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h1 className="font-bold text-lg text-white">
                        {card.name}
                      </h1>
                      <h2 className="uppercase font-normal text-sm text-gray50">
                        {card.category}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full">
                    <div className="flex-grow">
                      <Image
                        src={`${SERVER_SETTINGS.RESTAURANT_PIC_LINK}/${card.nftImageUrl}`}
                        alt={`${card.name} NFT`}
                        width={1000}
                        height={1000}
                        className="rounded-xl w-full max-h-[300px] object-cover"
                      />
                    </div>
                    <div className="min-w-[100px] max-h-full rounded-xl bg-gray500 border border-gray400 flex flex-col justify-center items-center">
                      <div className="flex flex-col justify-center items-center gap-1 h-full border-b border-gray400">
                        <h1 className="font-bold text-4xl text-white">
                          {card.visitCount < 10
                            ? `0${card.visitCount}`
                            : card.visitCount}
                        </h1>
                        <h2 className="font-normal text-sm text-gray50">
                          Check-ins
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute z-10 -right-28 opacity-80">
                  <APassStripes />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-4 h-12" />
    </div>
  );
};

export default StackedCard;

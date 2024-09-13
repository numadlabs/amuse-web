import React from "react";
import AuthenticatedLayout from "@/components/layout/layout";
import FeaturedListCard from "@/components/atom/featured-list-card";
import { useQuery } from "@tanstack/react-query";
import { getUserCard } from "@/lib/service/queryHelper";
import { RestaurantType } from "@/lib/types";
import { useRouter } from "next/router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import OwnedAcards from "@/components/atom/cards/owned-card";

const Membership = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: cards, isLoading } = useQuery({
    queryKey: ["cardKey"],
    queryFn: () => {
      return getUserCard();
    },
    enabled: !!session?.userId
  });

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
        {cards &&
          cards?.data?.cards.map((card: any) => (
            <OwnedAcards
              key={card.id}
              marker={card}
              onPress={() => handleNavigation(card)}
            />
          ))}
        </ScrollArea>
      </div>
    </AuthenticatedLayout>
  );
};

export default Membership;

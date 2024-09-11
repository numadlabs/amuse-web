import React from "react";
import PerkIcon from "@/components/icons/perk-icon";
import { Button } from "@/components/ui/button";

interface powerUpProps {
    title: string;
}

const PowerUpCard: React.FC<powerUpProps> = ({ title }) => {
  return (
    <div className="flex flex-row justify-between items-center bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl py-4 px-5">
      <div className="flex flex-row gap-3 items-center">
        <PerkIcon size={24} />
        <p className="text-md font-semibold text-gray00">{title}</p>
      </div>
      <Button size={"sm"} variant={"secondary"}>
        Use
      </Button>
    </div>
  );
};

export default PowerUpCard;

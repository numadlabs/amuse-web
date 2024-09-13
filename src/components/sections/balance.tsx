import React from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import APassStripes from "../icons/apass-stripes";

// You'll need to create this icon component
// import APassStripes from "@/components/icons/APassStripes";

interface BalanceProps {
  amount?: number;
  convertedAmount: number;
  currencyName: string;
  handleToggle: () => void;
}

const Balance: React.FC<BalanceProps> = ({
  amount,
  handleToggle,
  convertedAmount,
  currencyName,
}) => {
  return (
    <>
      <Card className="relative overflow-hidden bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] flex items-center">
        <div className="flex flex-col gap-3 items-start pt-3 pb-4 px-4 w-full z-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray100">Total balance</p>
            <div className="flex flex-row gap-2 items-end">
              <p className="text-3xl text-gray00">
                {amount === 0 ? "0.0000" : convertedAmount.toFixed(2)}
              </p>
              <p className="text-lg text-gray100 mb-1">{currencyName}</p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-row gap-1 items-center">
              <span className="text-sm text-gray50">≈</span>
              <Image
                src="/images/bitcoin.png"
                alt="Bitcoin"
                width={12}
                height={12}
              />
              <span className="text-sm text-gray50">
                {amount?.toFixed(8)} Bitcoin
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="w-4 h-4 z-10"
            >
              <Info size={16} color="#D7DADC"/>
            </Button>
          </div>
        </div>
        <div className="absolute -right-16 opacity-80 z-0">
          <APassStripes width={240} height={600}/>
        </div>
      </Card>
    </>
  );
};

export default Balance;

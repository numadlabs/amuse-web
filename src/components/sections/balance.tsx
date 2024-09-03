import React from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="mt-8 px-4">
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E] to-[#3A3A3A] border border-gray-700">
        <div className="absolute -top-16 -right-20 rotate-270">
          <Image src={'/apass-stripes.svg'} height={242} width={322} alt='apass-stripes'/>
        </div>
        <div className="flex flex-col items-start p-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-gray-300">Total balance</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-semibold text-white">
                {amount === 0 ? "0.0000" : convertedAmount.toFixed(2)}
              </span>
              <span className="text-base text-gray-300">{currencyName}</span>
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-400">≈</span>
              <Image
                src="/images/Bitcoin.png"
                alt="Bitcoin"
                width={12}
                height={12}
              />
              <span className="text-sm text-gray-400">
                {amount?.toFixed(8)} Bitcoin
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggle}
              className="text-gray-400 hover:text-gray-300"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Balance;
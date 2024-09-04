import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import { div } from "framer-motion/client";

const QuickInfo = ({ user, onPress }) => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const totalFields = 4;
      const filledFields = [
        user?.nickname,
        user?.email,
        user?.location,
        user?.dateOfBirth,
      ].filter((field) => field !== null).length;
      const newProgress = (filledFields / totalFields) * 100;
      setProgress(newProgress);
    }
  }, [user]);

  const handleNavigation = () => {
    if (user?.email) {
      router.push("/boost/Area");
    } else {
      router.push("/boost/Email");
    }
  };

  return (
    <Card
      className="w-[90%] relative bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-[20px] h-fit"
      onClick={handleNavigation}
    >
      <div className="pt-6 pb-4 px-4 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-gray00 font-bold text-lg">
            Earn 1.2x more rewards
          </p>
          <p className="text-gray100 text-sm">By completing your profile</p>
        </div>

        <div className="flex flex-row items-center gap-3">
          <Progress value={progress} className="flex-grow h-2" />
          <span className="text-gray00 font-bold text-sm">{`${Math.round(
            progress
          )}%`}</span>
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <Button
          variant="secondary"
          className="w-8"
          onClick={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <span>
            <X className="h-4 w-4" />
          </span>
        </Button>
      </div>
    </Card>
  );
};

export default QuickInfo;

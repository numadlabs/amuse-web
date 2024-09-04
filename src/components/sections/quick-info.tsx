import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

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
      className="w-full max-w-md mx-auto rounded-3xl border border-gray-400 bg-gradient-to-br from-brand-card-start to-brand-card-end relative"
      onClick={handleNavigation}
    >
      <CardContent className="p-6 pt-10">
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-3 top-3 bg-gray-400 hover:bg-gray-500"
          onClick={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-5">
          <h2 className="text-white font-bold text-lg">
            Earn 1.2x more rewards
          </h2>
          <p className="text-gray-100 text-sm">By completing your profile</p>
        </div>

        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-grow" />
          <span className="text-white font-bold text-sm">{`${Math.round(
            progress
          )}%`}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickInfo;

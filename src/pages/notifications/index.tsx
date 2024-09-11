import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import { getUserNotification } from "@/lib/service/queryHelper";
// import { useAuth } from "@/context/AuthContext";
import { Bell, Bitcoin, ScanBarcode } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import NotificationCard from "@/components/atom/cards/NotificationCard";
import AuthenticatedLayout from "@/components/layout/layout";
import { TicketStar } from "iconsax-react";

const Notification = () => {
  //   const { authState } = useAuth();
  const { session, status } = useAuth();
  const { data: userNotifications = [], isLoading } = useQuery({
    queryKey: userKeys.notifications,
    queryFn: getUserNotification,
    enabled: !!session?.user?.id,
    // enabled: !!authState.userId,
  });

  const reversedNotifications = useMemo(() => {
    return [...userNotifications].reverse();
  }, [userNotifications]);

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "REWARD":
        return <TicketStar size={20} />;
      case "TAP":
        return <ScanBarcode size={20} />;
      case "BONUS":
        return <Bitcoin size={20} />;
      default:
        return <Bitcoin size={20} />;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        <div className="px-4 w-full h-screen">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : userNotifications.length > 0 ? (
            <div className="space-y-4">
              {reversedNotifications.map((item, index) => (
                <NotificationCard
                  key={index}
                  title={item?.message}
                  description={item?.message}
                  type={item?.type}
                  time={getRelativeTime(item.createdAt)}
                  //   icon={getNotificationIcon(item?.type)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[812px]">
              <div className="bg-gray400 p-3 rounded-full mb-4">
                <Bell size={24} color="#ffffff" className="" />
              </div>
              <h2 className="text-lg text-gray50 font-semibold mb-2">
                No notification yet
              </h2>
              <p className="text-gray100 text-sm text-center">
                We will notify you when something arrives.
              </p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Notification;

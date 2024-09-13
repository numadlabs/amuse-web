import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/lib/service/keysHelper";
import { getUserNotification } from "@/lib/service/queryHelper";
import { Bell, Bitcoin, ScanBarcode } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";
import NotificationCard from "@/components/atom/cards/NotificationCard";
import AuthenticatedLayout from "@/components/layout/layout";
import { TicketStar } from "iconsax-react";
import { useSession } from "next-auth/react";

const Notification = () => {
  const { data: session } = useSession();
  const { data: userNotifications = [], isLoading } = useQuery({
    queryKey: userKeys.notifications,
    queryFn: getUserNotification,
    enabled: !!session?.userId,
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

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "REWARD": return Bitcoin;
      case "TAP": return ScanBarcode;
      case "BONUS": return Bitcoin;
      default: return Bell;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-background">
        <div className="px-4 w-full py-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : userNotifications.length > 0 ? (
            <div className="space-y-4 mb-4">
              {reversedNotifications.map((item, index) => (
                <NotificationCard
                  key={index}
                  title={"Notification"}
                  description={item?.message}
                  type={item?.type}
                  time={getRelativeTime(item.createdAt)}
                  icon={getNotificationIcon(item.type)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray400 p-3 rounded-full mb-4">
                <Bell size={24} color="#ffffff" />
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
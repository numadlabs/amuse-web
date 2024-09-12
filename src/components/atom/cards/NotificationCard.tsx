import React from "react";

interface NotificationProps {
  title: string;
  type: string;
  time: string;
  description: string;
  icon: any;
}

const NotificationCard: React.FC<NotificationProps> = ({
  title,
  type,
  time,
  description,
  icon: Icon,
}) => {
  return (
    <div className="bg-gradient-to-b from-gray500 to-transparent border border-gray400 rounded-2xl flex flex-row items-center gap-3 p-3 relative">
      <div className="h-10 w-10 bg-gray400 flex justify-center items-center rounded-[20px]">
        <Icon size={20} color="#FFFFFF" />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-md font-semibold text-gray00">{type}</p>
        <p className="text-sm text-gray100">{description}</p>
      </div>
      <div className="absolute right-3 top-3">
        <p className="text-sm text-gray100">{time}</p>
      </div>
    </div>
  );
};

export default NotificationCard;

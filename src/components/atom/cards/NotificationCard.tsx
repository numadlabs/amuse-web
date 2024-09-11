import React from "react";

interface NotificationProps {
  title: string;
  type: string;
  time: string;
  description: string;
}

const NotificationCard: React.FC<NotificationProps> = ({
  title,
  type,
  time,
  description,
}) => {
  return (
    <div className="flex justify-between bg-gradient-to-br from-[#242E35] to-transparent border border-gray400 rounded-2xl h-16 p-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray400 p-[10px] rounded-full">{type}</div>
        <div className="flex flex-col items-center gap-[6px]">
          <h4 className="text-white font-semibold text-sm2 pr-5">{title}</h4>
          <p className="text-gray100 text-sm font-normal">{description}</p>
        </div>
      </div>
      <div className="relative bottom-2 right-2">
        <span className="text-xs text-white">{time}</span>
      </div>
    </div>
  );
};

export default NotificationCard;

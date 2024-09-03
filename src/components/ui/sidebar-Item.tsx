import React from "react";

interface SidebarProps {
  label: string;
  icon: any;
  handleNavigation: () => void;
  active: boolean;
}

const SidebarItem: React.FC<SidebarProps> = ({
  label,
  icon: Icon,
  handleNavigation,
  active,
}) => {
  return (
    <div
      className={`flex flex-row py-3 px-4 cursor-pointer rounded-xl gap-3 items-center max-w-[240px] w-screen ${
        active
          ? "border border-gray400 bg-gradient-to-b from-gray500 to-transparent"
          : ""
      } `}
      onClick={handleNavigation}
    >
      <Icon size={24} color={`${active ? "#D7DADC" : "#9AA2A7"}`} />
      <p className={`${active ? "text-gray50" : "text-gray100"} text-lg`}>
        {label}
      </p>
    </div>
  );
};

export default SidebarItem;

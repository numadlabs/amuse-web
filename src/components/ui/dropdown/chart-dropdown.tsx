import React, { useState } from "react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";

// const data = ["Last 7 days", "Last 30 days", "Last 3 months", "Last year", "All time"];

interface dropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  selectOption: (option: string) => void;
  selectedOption: string;
  data: string[];
}

const ChartDropdown: React.FC<dropdownProps> = ({ isOpen, toggleDropdown,selectOption, selectedOption, data }) => {
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedOption, setSelectedOption] = useState("All time");

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // const selectOption = (option: string) => {
  //   setSelectedOption(option);
  //   setIsOpen(false);
  // };

  return (
    <div className="relative inline-block">
      <button
        className="bg-gray400 h-8 rounded-[48px] px-4 inline-flex items-center flex-row gap-2 hover:opacity-75 transition-all duration-200"
        onClick={toggleDropdown}
      >
        <span className="text-sm text-gray00 font-semibold">
          {selectedOption}
        </span>
        <div
          className={`transition-transform ease-out duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ArrowDown2 size={16} color={"#FFFFFF"} />
        </div>
      </button>
      <div
        className={`absolute right-0 -mt-10 w-40 rounded-2xl bg-gray500 border border-gray400 p-2 gap-2 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[248px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-1 gap-1">
          {data?.map((option, index) => (
            <div className="mx-1 hover:bg-gray400 rounded-xl" key={index}>
              <button
                className="h-10 w-full text-center text-sm text-gray00 font-semibold hover:bg-gradient-to-r hover:from-gradientStart hover:to-gradientEnd hover:text-transparent hover:bg-clip-text"
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
              {option !== "Yearly" && <hr className="border border-transparent" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartDropdown;

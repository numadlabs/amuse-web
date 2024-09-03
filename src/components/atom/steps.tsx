import React from "react";

interface StepsProps {
  activeStep: number;
}

const Steps: React.FC<StepsProps> = ({ activeStep }) => {
  return (
    <div className="flex justify-center items-center py-2 px-0.5 h-6 bg-gray-800">
      <div className="flex rounded-full overflow-hidden bg-gray-600">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-16 h-2 ${
              activeStep === step
                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Steps;

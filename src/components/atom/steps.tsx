import React from "react";

interface StepsProps {
  activeStep: number;
}

const Steps: React.FC<StepsProps> = ({ activeStep }) => {
  return (
    <div className="flex justify-center items-center py-2 h-2 rounded-[4px]">
      <div className="flex justify-center mb-10 rounded-full overflow-hidden bg-gray400">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-16 h-2 rounded-full ${
              activeStep === step
                ? "custom-gradient"
                : "bg-gray400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Steps;

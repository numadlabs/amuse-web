import React from "react";

interface StepsProps {
  activeStep: number;
  totalSteps?: number;
}

const Steps: React.FC<StepsProps> = ({ activeStep, totalSteps = 4 }) => {
  const progressWidth = `${(activeStep / totalSteps) * 100}%`;

  return (
    <div className="flex justify-center items-center py-2 h-2 rounded-[4px] max-w-[480px] w-screen">
      <div className="relative flex justify-start mb-10 rounded-full overflow-hidden bg-gray400 w-full h-2">
        <div
          className="absolute top-0 left-0 h-full custom-gradient transition-all duration-300 ease-in-out"
          style={{ width: progressWidth }}
        />
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-px h-full bg-gray400 ${
              index === 0 ? 'hidden' : ''
            }`}
            style={{
              left: `${((index + 1) / totalSteps) * 100}%`,
              position: 'absolute',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Steps;
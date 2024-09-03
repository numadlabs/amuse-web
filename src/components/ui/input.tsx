import * as React from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "iconsax-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div
        className={`rounded-2xl h-fit transition-colors duration-200 w-full ${
          isFocused
            ? "bg-gradient-to-r p-[1px] from-gradientStart to-gradientEnd"
            : "border border-gray400"
        }`}
      >
        <div className="w-full flex flex-row gap-3 bg-gray500 items-center h-12 px-4 rounded-2xl">
          {icon && <div>{icon}</div>}
          <input
            {...props}
            ref={ref}
            type={type}
            className="bg-gray500 outline-none w-full h-12 text-gray00"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };

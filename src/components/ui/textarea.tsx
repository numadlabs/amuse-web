import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    return (
      <div
        className={`w-full rounded-2xl ${
          isFocused
            ? "bg-gradient-to-r p-[1px] from-gradientStart to-gradientEnd"
            : " border border-gray400"
        }`}
      >
        <textarea
          className="bg-gray500 w-full outline-none h-[88px] flex text-start px-4 py-[14px] text-lg text-gray00 rounded-2xl"
          {...props}
          ref={ref}
          style={{ resize: "none" }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

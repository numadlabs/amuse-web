// import { Toaster as RadToaster } from "sonner";

// export function Toaster() {
//   return <RadToaster position="bottom-right"/>;
// };
import { Toaster as RadToaster } from "sonner";
import { useState, useEffect } from "react";

export function Toaster() {
  const [toastStyles, setToastStyles] = useState({});

  useEffect(() => {
    setToastStyles({
      background:
        "linear-gradient(158.32deg, #242E35 0%, rgba(36, 46, 53, 0.4) 100%)",
      color: "#ffffff",
      borderRadius: "16px",
      padding: "20px 28px 20px 28px",
      gap: "24px",
      border: "1px solid #2d3a42",
      borderLeft: "8px solid #2CB59E",
      "& .sonner-toast-description": {
        color: "#9AA2A7",
      },
    });
  }, []);

  return (
    <RadToaster position="bottom-right" toastOptions={{ style: toastStyles }} />
  );
}
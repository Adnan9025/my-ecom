import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Spinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <Loader2
        className={clsx(
          "animate-spin text-indigo-600",
          sizeClasses[size] || sizeClasses.md
        )}
      />
    </div>
  );
}
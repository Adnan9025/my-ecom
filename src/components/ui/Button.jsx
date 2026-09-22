import clsx from "clsx";
import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white",

    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white",

    outline:
      "border border-slate-300 bg-white hover:bg-slate-100 text-slate-900",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-6 py-3",

    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-xl font-semibold transition flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon}

      {children}
    </motion.button>
  );
}
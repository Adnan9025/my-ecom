import { motion } from "framer-motion";
import clsx from "clsx";

export default function Card({
  children,
  className,
  hover = false,
  animated = false,
  onClick,
}) {
  const cardClassName = clsx(
    "rounded-2xl bg-white border border-slate-100 shadow-sm",
    hover &&
      "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
    onClick && "cursor-pointer",
    className
  );

  if (animated) {
    return (
      <motion.div
        className={cardClassName}
        whileHover={hover ? { y: -4 } : undefined}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClassName} onClick={onClick}>
      {children}
    </div>
  );
}
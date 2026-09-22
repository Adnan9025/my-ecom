import clsx from "clsx";

export default function LoadingSkeleton({
  className,
  variant = "default",
}) {
  const variants = {
    default: "h-4 w-full",
    text: "h-4 w-full",
    title: "h-8 w-3/4",
    image: "h-64 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-11 w-32 rounded-xl",
    card: "h-80 w-full rounded-2xl",
  };

  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse rounded-lg bg-slate-200",
        variants[variant] || variants.default,
        className
      )}
    />
  );
}
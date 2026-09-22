import clsx from "clsx";

export default function Price({
  price,
  oldPrice,
  size = "large",
  currency = "$",
}) {
  return (
    <div className="flex items-center gap-3">

      <span
        className={clsx(
          "font-black text-indigo-600",
          size === "large" && "text-3xl",
          size === "medium" && "text-2xl",
          size === "small" && "text-lg"
        )}
      >
        {currency}
        {price}
      </span>

      {oldPrice && (
        <span className="text-slate-400 line-through">
          {currency}
          {oldPrice}
        </span>
      )}

    </div>
  );
}
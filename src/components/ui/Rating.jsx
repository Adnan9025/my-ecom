import { Star } from "lucide-react";
import clsx from "clsx";

export default function Rating({
  rating = 5,
  reviews,
  size = 18,
  showValue = true,
}) {
  return (
    <div className="flex items-center gap-1">

      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={clsx(
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          )}
        />
      ))}

      {showValue && (
        <span className="ml-2 text-sm text-slate-500">
          {rating.toFixed(1)}
        </span>
      )}

      {reviews && (
        <span className="text-sm text-slate-400">
          ({reviews} reviews)
        </span>
      )}

    </div>
  );
}
import { PackageOpen } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  title = "Nothing here yet",
  message = "There are no items to display.",
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <PackageOpen size={30} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-slate-500">
        {message}
      </p>

      {actionText && onAction && (
        <Button
          type="button"
          variant="primary"
          onClick={onAction}
          className="mt-6"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
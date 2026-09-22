import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({
  items,
}) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500">

      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2"
        >
          {item.link ? (
            <Link
              to={item.link}
              className="hover:text-indigo-600"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}

          {index !== items.length - 1 && (
            <ChevronRight size={15} />
          )}
        </div>
      ))}

    </nav>
  );
}
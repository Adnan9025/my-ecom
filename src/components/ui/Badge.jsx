import clsx from "clsx";

export default function Badge({ type = "new", children }) {
  const styles = {
    sale: "bg-red-500 text-white",
    new: "bg-indigo-600 text-white",
    hot: "bg-orange-500 text-white",
    featured: "bg-emerald-600 text-white",
    outofstock: "bg-gray-500 text-white",
  };

  return (
    <span
      className={clsx(
        "absolute top-5 left-5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide",
        styles[type] || styles.new
      )}
    >
      {children || type}
    </span>
  );
}
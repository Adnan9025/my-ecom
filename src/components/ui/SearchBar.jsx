import { Search, X } from "lucide-react";

export default function SearchBar({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Search products...",
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(value);
    }
  };

  const clearSearch = () => {
    if (onChange) {
      onChange("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-12 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      {value && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
}
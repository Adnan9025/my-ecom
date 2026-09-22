import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  quantity = 1,
  min = 1,
  max = 99,
  onChange,
}) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">

      <button
        onClick={decrease}
        className="px-4 py-2 hover:bg-slate-100 transition"
      >
        <Minus size={18} />
      </button>

      <span className="px-5 font-semibold min-w-[50px] text-center">
        {quantity}
      </span>

      <button
        onClick={increase}
        className="px-4 py-2 hover:bg-slate-100 transition"
      >
        <Plus size={18} />
      </button>

    </div>
  );
}
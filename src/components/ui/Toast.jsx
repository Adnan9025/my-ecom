import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle size={22} />,
  error: <AlertCircle size={22} />,
  info: <Info size={22} />,
};

const colors = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-indigo-600",
};

export default function Toast({
  show,
  message,
  type = "success",
  onClose,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white ${colors[type]}`}
        >
          {icons[type]}

          <span className="font-medium">
            {message}
          </span>

          <button
            onClick={onClose}
            className="ml-2 hover:opacity-80 transition"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
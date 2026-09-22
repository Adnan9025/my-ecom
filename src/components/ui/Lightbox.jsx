import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Lightbox({
  image,
  isOpen,
  onClose,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-red-400 transition"
          >
            <X size={32} />
          </button>

          <motion.img
            src={image}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            initial={{ scale: .8 }}
            animate={{ scale: 1 }}
            exit={{ scale: .8 }}
            transition={{ duration: .25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
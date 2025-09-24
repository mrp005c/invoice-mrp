"use client";
import { motion } from "framer-motion";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // don’t render if closed

  return (
    <div className="fixed inset-0 bg-[#00000089] transition-all  flex items-center justify-center z-40">
      {/* Background overlay */}
      <div
        className="absolute inset-0 "
        onClick={onClose} // close when clicking background
      ></div>

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white  rounded-xl shadow-lg p-6 w-full max-w-md z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

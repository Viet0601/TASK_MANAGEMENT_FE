import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmModal.scss";

const ConfirmModal = ({ open, title, message,name, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="confirm-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="confirm-modal"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="confirm-modal__title">{title || "Xác nhận"}</h3>
            <p className="confirm-modal__message">{message}: <b>{name}</b></p>
            <div className="confirm-modal__actions">
              <button className="btn cancel" onClick={onCancel}>
                Hủy
              </button>
              <button className="btn confirm" onClick={onConfirm}>
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

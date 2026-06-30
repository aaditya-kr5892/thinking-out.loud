import React from "react";
import { createPortal } from "react-dom";

function ConfirmationModal({ isOpen, onClose, onConfirm, title = "Confirm Action", message = "Are you sure you want to proceed?" }) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1c1c1c] border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
            {title}
          </h4>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed font-light">
          {message}
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-sm transition-colors cursor-pointer text-center"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-full shadow-sm transition-colors cursor-pointer text-center"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmationModal;

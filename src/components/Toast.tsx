import React from 'react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onUndo?: () => void;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isOpen, onUndo, onClose }) => {
  if (!isOpen) return null;

  return (
    <aside
      aria-atomic="true"
      aria-live="polite"
      id="toastFeedback"
      className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between p-3.5 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg transform transition-all duration-300 max-w-md mx-auto animate-fadeIn"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="material-symbols-outlined text-[20px] text-primary-fixed">
          check_circle
        </span>
        <span className="font-body-sm text-body-sm font-medium truncate" id="toastMessage">
          {message}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onUndo && (
          <button
            type="button"
            onClick={onUndo}
            id="toastUndoBtn"
            className="px-2.5 py-1 rounded bg-inverse-surface hover:bg-surface-container-highest/20 text-primary-fixed font-label-md text-label-md font-semibold transition-colors cursor-pointer"
          >
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          id="toastCloseBtn"
          aria-label="Close notification"
          className="text-inverse-on-surface/70 hover:text-inverse-on-surface flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </aside>
  );
};

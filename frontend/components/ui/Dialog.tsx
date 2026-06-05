import React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Dialog({ open, onClose, children, title }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative bg-[#0A0A0F] border border-[#1F2937] rounded-lg shadow-2xl w-[70%] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2937]">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>

        {/* Footer with Close Button */}
        <div className="flex justify-end px-6 py-4 border-t border-[#1F2937]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1F2937] text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;

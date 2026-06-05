import React from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
  return (
    <div className={`fixed inset-0 z-50 pointer-events-${open ? "auto" : "none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full md:w-2/5 bg-[#08080B] border-l border-[#1F2937] transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-auto p-6">{children}</div>
      </aside>
    </div>
  );
}

export default Drawer;

"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  open, onClose, onConfirm, title, message, confirmLabel = "Confirm", destructive = false, children,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className={`flex items-start gap-3 ${destructive ? "text-red-500" : "text-primary"}`}>
          <AlertTriangle size={20} className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-primary text-base">{title}</h3>
            <p className="text-sm text-secondary mt-1">{message}</p>
          </div>
        </div>
        {children && <div>{children}</div>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm rounded-lg font-medium text-white transition-colors ${destructive ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-gray-800"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { PrimaryButton, SecondaryButton } from "./Button";

/** Accessible confirm dialog built on the native <dialog> element (focus-trapped, Esc closes). */
export function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto max-w-md rounded-[1.75rem] p-0 backdrop:bg-ink/50"
      aria-labelledby="confirm-title"
    >
      <div className="space-y-4 p-6">
        <h2 id="confirm-title" className="text-2xl font-bold text-royal-dark">
          {title}
        </h2>
        <p className="text-ink-soft">{message}</p>
        <div className="flex flex-wrap justify-end gap-3">
          <SecondaryButton onClick={onCancel}>{cancelLabel}</SecondaryButton>
          <PrimaryButton tone={danger ? "coral" : "royal"} onClick={onConfirm}>
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </dialog>
  );
}

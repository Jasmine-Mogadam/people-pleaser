import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import {
  ToastContext,
  TOAST_LIFETIME,
  type Toast,
  type ToastInput,
} from "./toastContext";

/**
 * Small non-blocking notifications. Actions report through these instead of a
 * dialog, so playing a turn never costs an extra click to dismiss something.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast: ToastInput) => {
    const id = nextId.current++;
    // Cap the stack so a burst of actions cannot bury the game.
    setToasts((current) => [...current.slice(-3), { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toastViewport" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(
      () => onDismiss(toast.id),
      TOAST_LIFETIME[toast.tone ?? "default"],
    );
    return () => clearTimeout(timer);
  }, [toast.id, toast.tone, onDismiss]);

  return (
    <div className={`toast ${toast.tone === "error" ? "toastError" : ""}`}>
      <button
        className="toastClose"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="toastTitle">{toast.title}</div>
      {toast.message && <div className="toastMessage">{toast.message}</div>}

      {toast.lines?.map((line) => (
        <div key={line.label} className="toastLine">
          <div className="toastLineHead">
            <span>{line.label}</span>
            {line.value && <span className="toastValue">{line.value}</span>}
          </div>
          {line.fill !== undefined && (
            <div
              className="toastBar"
              role="meter"
              aria-valuenow={Math.round((line.fill ?? 0) * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Friendship gained with ${line.label}`}
            >
              <div
                className="toastBarFill"
                style={{
                  width: `${Math.max(0, Math.min(1, line.fill)) * 100}%`,
                }}
              />
            </div>
          )}
          {line.sub?.map((s) => (
            <div key={s} className="toastSub">
              {s}
            </div>
          ))}
        </div>
      ))}

      {toast.notes?.map((note) => (
        <div key={note} className="toastNote">
          {note}
        </div>
      ))}
    </div>
  );
}

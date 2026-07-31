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
  TOAST_STACK,
  type Toast,
  type ToastInput,
} from "./toastContext";

/** Phone-sized screens have no room for a tall stack of notifications. */
const SMALL_SCREEN = "(max-width: 640px)";

function useSmallScreen(): boolean {
  const [small, setSmall] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia(SMALL_SCREEN).matches,
  );
  useEffect(() => {
    const query = window.matchMedia(SMALL_SCREEN);
    const update = () => setSmall(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return small;
}

/**
 * Small non-blocking notifications. Actions report through these instead of a
 * dialog, so playing a turn never costs an extra click to dismiss something.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const small = useSmallScreen();

  // Held in a ref so `push` never changes identity, which would re-render every
  // screen holding on to it. Updated from an effect, not during render.
  const limit = useRef(TOAST_STACK.default);
  useEffect(() => {
    limit.current = small ? TOAST_STACK.small : TOAST_STACK.default;
  }, [small]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast: ToastInput) => {
    const id = nextId.current++;
    setToasts((current) => [
      ...current.slice(-(limit.current - 1)),
      { ...toast, id },
    ]);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toastViewport" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            small={small}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  small,
  onDismiss,
}: {
  toast: Toast;
  small: boolean;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const tone = toast.tone ?? "default";
    const lifetime = small ? TOAST_LIFETIME.small[tone] : TOAST_LIFETIME.default[tone];
    const timer = setTimeout(() => onDismiss(toast.id), lifetime);
    return () => clearTimeout(timer);
  }, [toast.id, toast.tone, small, onDismiss]);

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
            <FriendshipBar
              label={line.label}
              fill={line.fill}
              delta={line.delta ?? 0}
            />
          )}
          {line.meta && <div className="toastMeta">{line.meta}</div>}
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

/**
 * Total friendship as a solid bar, with the change from this action tacked on
 * in its own colour and grown into place. A gain extends past where you were;
 * a loss trails behind where you are now.
 */
function FriendshipBar({
  label,
  fill,
  delta,
}: {
  label: string;
  fill: number;
  delta: number;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const change = Math.abs(delta);
  const held = delta >= 0 ? clamp(fill - change) : clamp(fill);

  return (
    <div
      className="toastBar"
      role="meter"
      aria-valuenow={Math.round(fill * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Total friendship with ${label}`}
    >
      <div className="toastBarHeld" style={{ width: `${held * 100}%` }} />
      {change > 0 && (
        <div
          className={delta >= 0 ? "toastBarGain" : "toastBarLoss"}
          style={{ "--delta": `${clamp(change) * 100}%` } as React.CSSProperties}
        />
      )}
    </div>
  );
}

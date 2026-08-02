import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import {
  ToastContext,
  ToastFeedContext,
  TOAST_LIFETIME,
  useToastFeed,
  type Toast,
  type ToastInput,
} from "./toastContext";

/** Long enough to play the banner out. Kept in step with the CSS. */
const EXIT_MS = 260;

/** Phone-sized screens have no room to leave a banner sitting there. */
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
 * Holds whatever the last action had to say. Nothing is drawn here: these show
 * up as notifications on the phone, so the handset renders them (see
 * PhoneNotice) and this only decides what is current.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Toast | undefined>(undefined);
  const nextId = useRef(0);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Dismissing does not remove it: a banner that vanishes the instant it expires
  // reads as a glitch, so it is flagged on its way out and held in the tree long
  // enough to animate off.
  const dismiss = useCallback((id: number) => {
    setCurrent((showing) =>
      showing?.id === id && !showing.leaving
        ? { ...showing, leaving: true }
        : showing,
    );
    clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => setCurrent(undefined), EXIT_MS);
  }, []);

  // A phone shows one notification at a time, so a new one replaces whatever is
  // still up rather than queueing behind it. Spamming an action therefore never
  // builds a pile that covers anything.
  const push = useCallback((toast: ToastInput) => {
    clearTimeout(exitTimer.current);
    setCurrent({ ...toast, id: nextId.current++ });
  }, []);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  const feed = useMemo(() => ({ current, dismiss }), [current, dismiss]);

  return (
    <ToastContext.Provider value={push}>
      <ToastFeedContext.Provider value={feed}>
        {children}
      </ToastFeedContext.Provider>
    </ToastContext.Provider>
  );
}

/**
 * The notification banner itself. Lives on the handset: over the screen while
 * the phone is up, and just above the bezel while it is face down on the table,
 * so an action taken away from the phone still lights it up.
 */
export function PhoneNotice({ away }: { away: boolean }) {
  const { current, dismiss } = useToastFeed();

  return (
    // The live region has to be in the document before the text changes, or a
    // screen reader has nothing to notice, so the wrapper is always rendered.
    <div
      className={`phoneNotice ${away ? "isAway" : ""}`}
      role="status"
      aria-live="polite"
    >
      {current && (
        <NoticeCard key={current.id} toast={current} onDismiss={dismiss} />
      )}
    </div>
  );
}

function NoticeCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const small = useSmallScreen();

  useEffect(() => {
    if (toast.leaving) return;
    const tone = toast.tone ?? "default";
    const lifetime = small
      ? TOAST_LIFETIME.small[tone]
      : TOAST_LIFETIME.default[tone];
    const timer = setTimeout(() => onDismiss(toast.id), lifetime);
    return () => clearTimeout(timer);
  }, [toast.id, toast.tone, toast.leaving, small, onDismiss]);

  return (
    <div
      className={`toast ${toast.tone === "error" ? "toastError" : ""}`}
      data-state={toast.leaving ? "leaving" : "showing"}
    >
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

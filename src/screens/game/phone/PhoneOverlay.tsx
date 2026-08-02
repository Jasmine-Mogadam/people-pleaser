import type { ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Something that takes the phone's screen over rather than the window's. The
 * whole game is played through the handset, so an interruption that covered the
 * world instead would be the one thing on screen that was not part of it.
 *
 * Rendered inside the glass, so it darkens the screen and nothing else.
 */
function PhoneOverlay({
  label,
  onClose,
  children,
  actions,
}: {
  /** Names the overlay for anybody who cannot see it. */
  label: string;
  /** Left out when the choice has to be made rather than dismissed. */
  onClose?: () => void;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="phoneOverlay" role="dialog" aria-modal="true" aria-label={label}>
      <div className="phoneOverlayCard">
        {onClose && (
          <button
            className="phoneOverlayClose"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </button>
        )}

        {/* Short screens have to be able to see the point of it, so the body
            scrolls before the buttons get pushed off the bottom. */}
        <div className="phoneOverlayBody">{children}</div>
        <div className="phoneOverlayActions">{actions}</div>
      </div>
    </div>
  );
}

export default PhoneOverlay;

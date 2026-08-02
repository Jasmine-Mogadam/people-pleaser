import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { Badge } from "@/components/ui/badge";
import PhoneOverlay from "./PhoneOverlay";
import type { Friend } from "@/objects/friend";

/**
 * The one interruption worth keeping: meeting somebody new is rare enough that
 * it deserves taking the screen over, and the player wants to see who it is.
 *
 * It takes over the phone's screen because that is where you were when it
 * happened -- every way of meeting somebody (a chat, a night out, a solo visit,
 * a scroll) is something you did on the handset.
 */
function NewFriend({
  friend,
  onClose,
}: {
  friend: Friend | null;
  onClose: () => void;
}) {
  if (!friend) return null;

  return (
    <PhoneOverlay
      label={`You befriended ${friend.name}`}
      onClose={onClose}
      actions={
        <Button className="w-full" onClick={onClose}>
          Yippie!
        </Button>
      }
    >
      <h2 className="overlayTitle">You befriended {friend.name}</h2>
      {/* Short screens give up portrait before they give up words. */}
      <EntityImage
        src={friend.image}
        name={friend.name}
        className="overlayArt"
      />
      <div className="grid justify-items-center gap-1">
        <Badge variant="outline">{friend.personality}</Badge>
        <a
          href={friend.ownerUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs"
        >
          owned by {friend.owner}
        </a>
      </div>
      <p className="phoneHint">They are in your contacts now.</p>
    </PhoneOverlay>
  );
}

export default NewFriend;

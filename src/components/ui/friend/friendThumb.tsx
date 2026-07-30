import type { Friend } from "../../../objects/friend";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { friendshipTier } from "@/game/rules";

function FriendThumb({
  friend,
  isActive,
  friendshipLevel,
  disabled = false,
  onClick = () => {},
}: {
  friend: Friend;
  isActive?: boolean;
  /** Left out in the gallery, where friendship does not apply. */
  friendshipLevel?: number;
  disabled?: boolean;
  onClick?: (friend: Friend) => void;
}) {
  return (
    <Button
      variant="outline"
      aria-pressed={isActive}
      disabled={disabled}
      className={`border-3 w-40 h-40 overflow-hidden relative m-2 p-1.5 ${
        isActive ? "border-primary" : ""
      }`}
      style={{ backgroundColor: isActive ? "var(--ring)" : undefined }}
      onClick={() => onClick(friend)}
    >
      <EntityImage src={friend.image} name={friend.name} size="100%" />
      <div
        className="absolute bottom-0 left-0 right-0 p-1 text-xs"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", color: "white" }}
      >
        <div>{friend.name}</div>
        {friendshipLevel !== undefined && (
          <div className="opacity-80">
            {friendshipTier(friendshipLevel)} · {Math.round(friendshipLevel)}
          </div>
        )}
      </div>
    </Button>
  );
}
export default FriendThumb;

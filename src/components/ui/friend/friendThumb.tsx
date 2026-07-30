import type { ComponentProps } from "react";
import type { Friend } from "../../../objects/friend";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { friendshipTier } from "@/game/rules";

type ButtonProps = ComponentProps<typeof Button>;

/**
 * `rest` is spread onto the button so this can be handed to a DialogTrigger's
 * `render` prop -- that is how base-ui passes its own click handler and aria
 * state down. Picking is a separate prop from `onClick` so both can fire.
 */
function FriendThumb({
  friend,
  isActive,
  friendshipLevel,
  disabled = false,
  compact = false,
  onPick,
  ...rest
}: {
  friend: Friend;
  isActive?: boolean;
  /** Left out in the gallery, where friendship does not apply. */
  friendshipLevel?: number;
  disabled?: boolean;
  compact?: boolean;
  onPick?: (friend: Friend) => void;
} & ButtonProps) {
  const handleClick: NonNullable<ButtonProps["onClick"]> = (event) => {
    rest.onClick?.(event);
    onPick?.(friend);
  };

  return (
    <Button
      variant="outline"
      {...rest}
      aria-pressed={isActive}
      disabled={disabled}
      className={`friendThumb ${compact ? "friendThumbCompact" : ""} ${
        isActive ? "friendThumbActive" : ""
      } ${rest.className ?? ""}`}
      onClick={handleClick}
    >
      <EntityImage
        src={friend.image}
        name={friend.name}
        className="friendThumbArt"
      />
      <span className="friendThumbCaption">
        <span className="friendThumbName">{friend.name}</span>
        {friendshipLevel !== undefined && (
          <span className="friendThumbTier">
            {friendshipTier(friendshipLevel)} · {Math.round(friendshipLevel)}
          </span>
        )}
      </span>
    </Button>
  );
}
export default FriendThumb;

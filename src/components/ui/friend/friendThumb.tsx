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
  onPick,
  ...rest
}: {
  friend: Friend;
  isActive?: boolean;
  /** Left out in the gallery, where friendship does not apply. */
  friendshipLevel?: number;
  disabled?: boolean;
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
      className={`border-3 w-40 h-40 overflow-hidden relative m-2 p-1.5 ${
        isActive ? "border-primary" : ""
      } ${rest.className ?? ""}`}
      style={{ backgroundColor: isActive ? "var(--ring)" : undefined }}
      onClick={handleClick}
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

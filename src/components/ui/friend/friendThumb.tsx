import type { ComponentProps } from "react";
import type { Friend } from "../../../objects/friend";
import type { PreferenceType } from "../../../objects/preference";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import PreferenceTag from "@/components/ui/preferenceTag";
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
  preference,
  onPick,
  ...rest
}: {
  friend: Friend;
  isActive?: boolean;
  /** Left out in the gallery, where friendship does not apply. */
  friendshipLevel?: number;
  disabled?: boolean;
  compact?: boolean;
  /** How they feel about whatever they are being picked for, when it is known. */
  preference?: PreferenceType | null;
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
      data-preference={preference ?? undefined}
      className={`friendThumb ${compact ? "friendThumbCompact" : ""} ${
        isActive ? "friendThumbActive" : ""
      } ${rest.className ?? ""}`}
      onClick={handleClick}
    >
      {preference && <PreferenceTag preference={preference} />}
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

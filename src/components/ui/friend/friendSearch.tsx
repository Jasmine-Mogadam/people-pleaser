import type { Friend } from "../../../objects/friend";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import FriendDialog from "./friendDialog";
import FriendThumb from "./friendThumb";
import { useAppSelector } from "@/state/hooks";

/**
 * Browse mode opens a detail dialog. Select mode toggles thumbnails on and off,
 * and refuses to add more once `maxSelected` is reached.
 */
function FriendSearch({
  friends,
  select = false,
  selectedIds = [],
  maxSelected,
  showFriendship = true,
  revealAll = false,
  compact = false,
  onToggle = () => {},
}: {
  friends: Friend[];
  select?: boolean;
  selectedIds?: string[];
  maxSelected?: number;
  showFriendship?: boolean;
  revealAll?: boolean;
  /** Smaller thumbnails, for the narrow phone screens. */
  compact?: boolean;
  onToggle?: (friend: Friend) => void;
}) {
  const [friendFilter, setFriendFilter] = useState<string>("");
  const records = useAppSelector((state) => state.friends);

  const levelFor = (friend: Friend) =>
    records.find((r) => r.id === friend.id)?.friendshipLevel;

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(friendFilter.toLowerCase()),
  );
  const full = maxSelected !== undefined && selectedIds.length >= maxSelected;

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 shrink-0" />
        <Input
          onChange={(e) => setFriendFilter(e.target.value)}
          placeholder="Character name here..."
          aria-label="Filter by character name"
        />
      </div>
      {select && (
        <i className="text-xs text-muted-foreground">
          Click a thumbnail to add or remove someone
          {maxSelected !== undefined &&
            ` (${selectedIds.length}/${maxSelected} picked)`}
          .
        </i>
      )}
      <div className={compact ? "friendGrid friendGridCompact" : "friendGrid"}>
        {filtered.length > 0 ? (
          filtered.map((f) =>
            select ? (
              <FriendThumb
                friend={f}
                key={f.id}
                compact={compact}
                onPick={onToggle}
                isActive={selectedIds.includes(f.id)}
                friendshipLevel={showFriendship ? levelFor(f) : undefined}
                disabled={full && !selectedIds.includes(f.id)}
              />
            ) : (
              <FriendDialog
                friend={f}
                key={f.id}
                compact={compact}
                revealAll={revealAll}
                showFriendship={showFriendship}
              />
            ),
          )
        ) : (
          <div className="text-sm text-muted-foreground">No Friends Found</div>
        )}
      </div>
    </div>
  );
}
export default FriendSearch;

import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import { friendshipTier } from "@/game/rules";
import { useAppSelector } from "@/state/hooks";

/**
 * Everyone you know, as a contact list. Opening somebody goes to their profile
 * rather than a dialog, so the phone keeps behaving like a phone.
 */
function Contacts({ onOpenFriend }: { onOpenFriend: (id: string) => void }) {
  const records = useAppSelector((state) => state.friends);
  const [filter, setFilter] = useState("");

  // Records hold progress; the catalog holds the character. Join them after the
  // selector, so the selector keeps returning the same array reference.
  const met = records
    .map((record) => ({ record, friend: getFriend(record.id) }))
    .filter((entry): entry is { record: typeof entry.record; friend: Friend } =>
      Boolean(entry.friend),
    );

  const shown = met.filter((entry) =>
    entry.friend.name.toLowerCase().includes(filter.toLowerCase()),
  );

  if (met.length === 0) {
    return (
      <div className="screen">
        <p className="phoneHint">
          Nobody yet. Scroll WormGround, or pick a place on Maps and go alone.
        </p>
      </div>
    );
  }

  return (
    <div className="listScreen">
      <div className="listTop">
        <span className="listCount">
          {met.length} {met.length === 1 ? "Contact" : "Contacts"}
        </span>
        <div className="phoneSearch">
          <Search aria-hidden="true" />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Search friends…"
            aria-label="Search friends by name"
          />
        </div>
      </div>

      <div className="rowList">
        {shown.length === 0 ? (
          <p className="phoneHint">Nobody by that name.</p>
        ) : (
          shown.map(({ record, friend }) => (
            <button
              key={friend.id}
              className="phoneRow"
              onClick={() => onOpenFriend(friend.id)}
            >
              <span className="rowAvatar">
                <EntityImage src={friend.image} name={friend.name} />
              </span>
              <span className="rowBody">
                <span className="rowName">{friend.name}</span>
                <span className="rowSub">
                  {friendshipTier(record.friendshipLevel)} ·{" "}
                  {Math.round(record.friendshipLevel)}/100
                </span>
              </span>
              <ChevronRight className="rowChevron" aria-hidden="true" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default Contacts;

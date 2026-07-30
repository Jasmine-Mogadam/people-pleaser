import { ArrowUpRightIcon } from "lucide-react";
import type { Friend } from "../../../objects/friend";
import type { Preference } from "../../../objects/preference";
import { Badge } from "../badge";
import EntityImage from "@/components/ui/entityImage";
import { friendshipTier } from "@/game/rules";

function PreferenceList({
  preferences,
  emptyLabel,
}: {
  preferences: Preference[];
  emptyLabel: string;
}) {
  if (preferences.length === 0) {
    return <li className="text-xs text-muted-foreground">{emptyLabel}</li>;
  }
  return (
    <>
      {preferences.map((p) => (
        <li key={p.target.key} className="flex items-center gap-2">
          <EntityImage src={p.target.image} name={p.target.name} size={32} />
          <span>{p.target.name}</span>
        </li>
      ))}
    </>
  );
}

/**
 * `revealAll` is for the gallery. In game you only see the opinions you have
 * actually uncovered by chatting, gifting, or going somewhere together.
 */
function FriendDetail({
  friend,
  friendshipLevel,
  discoveredKeys,
  revealAll = false,
}: {
  friend: Friend;
  friendshipLevel?: number;
  discoveredKeys?: string[];
  revealAll?: boolean;
}) {
  const known = (list: Preference[]) =>
    revealAll ? list : list.filter((p) => (discoveredKeys ?? []).includes(p.target.key));

  const hiddenCount = revealAll
    ? 0
    : friend.preferences.length - known(friend.preferences).length;

  return (
    <div className="grid gap-4">
      <div className="flex gap-4">
        <EntityImage src={friend.image} name={friend.name} size={120} />
        <div className="grid content-start gap-1">
          <h1 className="text-xl font-semibold">{friend.name}</h1>
          <a href={friend.ownerUrl} target="_blank" rel="noreferrer">
            owned by&nbsp;
            <u className="inline-flex items-center">
              {friend.owner}
              <ArrowUpRightIcon className="h-4 w-4" />
            </u>
          </a>
          <div className="flex gap-2">
            <Badge>{friend.personality}</Badge>
            {friendshipLevel !== undefined && (
              <Badge variant="outline">
                {friendshipTier(friendshipLevel)} · {Math.round(friendshipLevel)}/100
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-medium">Likes</h2>
          <ul className="grid gap-1">
            <PreferenceList
              preferences={known(friend.getLikes())}
              emptyLabel="Nothing uncovered yet."
            />
          </ul>
        </div>
        <div>
          <h2 className="font-medium">Dislikes</h2>
          <ul className="grid gap-1">
            <PreferenceList
              preferences={known(friend.getDislikes())}
              emptyLabel="Nothing uncovered yet."
            />
          </ul>
        </div>
      </div>

      {hiddenCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {hiddenCount} opinion(s) still unknown. Chat, give gifts, or go places
          together to uncover them.
        </p>
      )}
    </div>
  );
}
export default FriendDetail;

import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import { FRIEND_THRESHOLD, friendshipTier, GAME_LENGTH_WEEKS } from "@/game/rules";
import { useAppSelector } from "@/state/hooks";

/** Score is the sum of every friendship, with a bonus for people who moved in. */
const ROOMMATE_BONUS = 25;

const ranks = [
  { min: 500, rank: "S" },
  { min: 380, rank: "A" },
  { min: 260, rank: "B" },
  { min: 150, rank: "C" },
  { min: 60, rank: "D" },
  { min: 0, rank: "E" },
];

function Ending({ onExit }: { onExit: () => void }) {
  const friends = useAppSelector((state) => state.friends);
  const roommateIds = useAppSelector((state) => state.house.roommateIds);
  const money = useAppSelector((state) => state.money);

  const friendshipTotal = friends.reduce((sum, f) => sum + f.friendshipLevel, 0);
  const score = Math.round(friendshipTotal + roommateIds.length * ROOMMATE_BONUS);
  const rank = ranks.find((r) => score >= r.min)?.rank ?? "E";
  const realFriends = friends.filter((f) => f.friendshipLevel >= FRIEND_THRESHOLD);
  const ranked = [...friends].sort((a, b) => b.friendshipLevel - a.friendshipLevel);

  return (
    <section className="mx-auto grid max-w-2xl gap-6 p-6">
      <header className="grid gap-1">
        <h1 className="text-2xl font-semibold">
          Week {GAME_LENGTH_WEEKS} — your birthday
        </h1>
        <p className="text-sm text-muted-foreground">
          Score {score} · Rank {rank}
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">People met</dt>
          <dd className="text-lg">{friends.length}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">
            Friends ({FRIEND_THRESHOLD}+)
          </dt>
          <dd className="text-lg">{realFriends.length}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Roommates</dt>
          <dd className="text-lg">{roommateIds.length}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Money left</dt>
          <dd className="text-lg">${Math.round(money)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        {ranked.map((record) => {
          const friend = getFriend(record.id);
          if (!friend) return null;
          return (
            <div key={record.id} className="grid w-24 gap-1 text-center text-xs">
              <EntityImage src={friend.image} name={friend.name} size={96} />
              <div className="font-medium">{friend.name}</div>
              <div className="text-muted-foreground">
                {friendshipTier(record.friendshipLevel)} ·{" "}
                {Math.round(record.friendshipLevel)}
              </div>
            </div>
          );
        })}
        {ranked.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You did not meet anybody. Chatting and going out are how you find
            people.
          </p>
        )}
      </div>

      <Button onClick={onExit}>Back to menu</Button>
    </section>
  );
}

export default Ending;

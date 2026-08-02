import { useState } from "react";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import { getHouse } from "@/objects/house";
import { evictRoommate, inviteRoommate } from "@/game/interactions";
import { useAnnounce } from "@/game/useAnnounce";
import {
  ROOMMATE_EVICTION_PENALTY,
  ROOMMATE_MIN_FRIENDSHIP,
  ROOMMATE_WEEKLY_GAIN,
} from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/**
 * Your place, and who lives in it. Asking somebody to move in -- and throwing
 * them back out -- happens here rather than in the room itself: the whole game
 * is played through the phone, and this is the one thing that used to be a
 * panel floating over the world.
 */
function Home() {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const houseState = useAppSelector((state) => state.house);
  const friends = useAppSelector((state) => state.friends);
  // Who the player has tapped "kick out" on but not yet gone through with.
  const [evicting, setEvicting] = useState<string | null>(null);

  const house = getHouse(houseState.id);

  const eligible = friends.filter(
    (f) =>
      f.friendshipLevel >= ROOMMATE_MIN_FRIENDSHIP &&
      !houseState.roommateIds.includes(f.id),
  );
  const hasRoom = houseState.roommateIds.length < house.maxRoomates;

  const ask = (id: string) => {
    const before = store.getState().house.roommateIds.length;
    const message = inviteRoommate(dispatch, store.getState(), id);
    announce({
      title: house.name,
      message,
      tone:
        store.getState().house.roommateIds.length > before ? "default" : "error",
    });
  };

  const evict = (id: string) => {
    setEvicting(null);
    const before = store.getState().house.roommateIds.length;
    const message = evictRoommate(dispatch, store.getState(), id);
    announce({
      title: house.name,
      message,
      tone:
        store.getState().house.roommateIds.length < before ? "default" : "error",
    });
  };

  return (
    <div className="screen">
      <div className="grid gap-1">
        <h2 className="sceneSubhead">{house.name}</h2>
        <p className="phoneHint">
          {house.maxRoomates === 0
            ? "No room for anyone else. Bigger places are in the shop."
            : `${houseState.roommateIds.length} of ${house.maxRoomates} rooms filled. Roommates gain ${ROOMMATE_WEEKLY_GAIN} friendship a week instead of drifting.`}
        </p>
      </div>

      {houseState.roommateIds.length > 0 && (
        <div className="grid gap-1.5">
          <span className="sceneSubhead">Living with you</span>
          {houseState.roommateIds.map((id) => {
            const friend = getFriend(id);
            if (!friend) return null;
            const level =
              friends.find((f) => f.id === id)?.friendshipLevel ?? 0;
            return (
              <div key={id} className="shopRow">
                <EntityImage src={friend.image} name={friend.name} size={28} />
                <span className="rowText">
                  <span className="rowTitle">{friend.name}</span>
                  <span className="rowMeta">{Math.round(level)}/100</span>
                </span>
                {/* Throwing somebody out cannot be taken back, and the friendship
                    it costs is gone the moment it happens, so it takes two taps
                    and says the price on the second one. */}
                {evicting === id ? (
                  <span className="confirmRow">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEvicting(null)}
                    >
                      Keep
                    </Button>
                    <Button size="sm" onClick={() => evict(id)}>
                      −{ROOMMATE_EVICTION_PENALTY}, out
                    </Button>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEvicting(id)}
                  >
                    Kick out
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {hasRoom && (
        <div className="grid gap-1.5">
          <span className="sceneSubhead">Ask someone to move in</span>
          {eligible.length === 0 ? (
            <p className="phoneHint">
              Nobody is close enough yet. Roommates need{" "}
              {ROOMMATE_MIN_FRIENDSHIP} friendship.
            </p>
          ) : (
            eligible.map((record) => {
              const friend = getFriend(record.id);
              if (!friend) return null;
              return (
                <Button
                  key={record.id}
                  variant="outline"
                  className="listRow"
                  onClick={() => ask(record.id)}
                >
                  <EntityImage src={friend.image} name={friend.name} size={28} />
                  <span className="rowText">
                    <span className="rowTitle">{friend.name}</span>
                    <span className="rowMeta">
                      {Math.round(record.friendshipLevel)}/100
                    </span>
                  </span>
                </Button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

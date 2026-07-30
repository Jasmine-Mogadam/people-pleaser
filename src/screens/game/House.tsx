import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import { getHouse } from "@/objects/house";
import { inviteRoommate } from "@/game/interactions";
import { useToast } from "@/components/ui/toastContext";
import { ROOMMATE_MIN_FRIENDSHIP, ROOMMATE_WEEKLY_GAIN } from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";
import "./House.css";

function House() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const houseState = useAppSelector((state) => state.house);
  const friends = useAppSelector((state) => state.friends);

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
    toast({
      title: house.name,
      message,
      tone:
        store.getState().house.roommateIds.length > before ? "default" : "error",
    });
  };

  function placeRoommates() {
    return house.roomatePositions.map((pos, index) => {
      const friendId = houseState.roommateIds[index];
      const friend = friendId ? getFriend(friendId) : undefined;
      if (!friend) return null;
      return (
        <div
          key={friend.id}
          className="roommate"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <EntityImage src={friend.image} name={friend.name} size={120} />
          <span className="roommateName">{friend.name}</span>
        </div>
      );
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="sceneTitle">{house.name}</h1>
        <p className="sceneMeta">
          {house.maxRoomates === 0
            ? "No room for anyone else. Bigger places are in the shop."
            : `${houseState.roommateIds.length} of ${house.maxRoomates} rooms filled. Roommates gain ${ROOMMATE_WEEKLY_GAIN} friendship a week instead of drifting.`}
        </p>
      </div>

      <div
        className="scene"
        style={house.image ? { backgroundImage: `url(${house.image})` } : undefined}
      >
        {!house.image && <div className="scenePlaceholder">{house.name}</div>}
        {placeRoommates()}
      </div>

      {hasRoom && (
        <div className="grid gap-2">
          <h2 className="text-base">Ask someone to move in</h2>
          {eligible.length === 0 ? (
            <p className="sceneMeta">
              Nobody is close enough yet. Roommates need{" "}
              {ROOMMATE_MIN_FRIENDSHIP} friendship.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {eligible.map((record) => {
                const friend = getFriend(record.id);
                if (!friend) return null;
                return (
                  <Button
                    key={record.id}
                    variant="outline"
                    onClick={() => ask(record.id)}
                  >
                    <EntityImage
                      src={friend.image}
                      name={friend.name}
                      size={22}
                    />
                    {friend.name} ({Math.round(record.friendshipLevel)})
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default House;

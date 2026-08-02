import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import { getHouse } from "@/objects/house";
import { useAppSelector } from "@/state/hooks";
import "./House.css";

/**
 * Your place, and whoever lives in it. Purely the scene: asking somebody to move
 * in happens on the phone, under Home.
 */
function House() {
  const houseState = useAppSelector((state) => state.house);
  const house = getHouse(houseState.id);

  return (
    <div className="scene">
      {house.image ? (
        <img className="sceneArt" src={house.image} alt="" />
      ) : (
        <div className="scenePlaceholder">{house.name}</div>
      )}
      <div className="sceneWash" aria-hidden="true" />

      {house.roomatePositions.map((pos, index) => {
        const friendId = houseState.roommateIds[index];
        const friend = friendId ? getFriend(friendId) : undefined;
        if (!friend) return null;
        return (
          <div
            key={friend.id}
            className="castFigure roommate"
            style={
              {
                // Positions are percentages of the room, so they scale with the
                // backdrop. They mark where somebody stands, hence the bottom edge.
                left: `${pos.x}%`,
                bottom: `${100 - pos.y}%`,
                // Standing higher up the room means standing further back in it.
                "--depth": 0.72 + (pos.y / 100) * 0.34,
              } as React.CSSProperties
            }
          >
            <span className="castShadow" aria-hidden="true" />
            <EntityImage
              src={friend.image}
              name={friend.name}
              className="castArt"
            />
            <span className="castName">{friend.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export default House;

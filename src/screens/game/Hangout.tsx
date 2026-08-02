import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import type { Hangout } from "@/objects/hangout";
import "./Hangout.css";

/**
 * Where guests stand, as a percentage across the floor, by how many turned up.
 * Hand-placed rather than spread evenly so that small groups keep out of the
 * middle, which is where the phone is parked.
 */
const STANDING_SPOTS: Record<number, number[]> = {
  1: [24],
  2: [18, 80],
  3: [15, 50, 85],
  4: [13, 34, 66, 87],
  5: [12, 30, 50, 70, 88],
};

function standingSpot(index: number, total: number): number {
  const spots = STANDING_SPOTS[total];
  return spots ? spots[index] : 10 + ((index + 1) * 80) / (total + 1);
}

/**
 * The venue, and whoever is in it. Purely the scene: choosing where to go, who
 * to take and whether to actually go through with it all happens on the phone,
 * under Maps.
 */
function HangoutDisplay({
  selectedHangout,
  guestIds,
}: {
  selectedHangout: Hangout | undefined;
  guestIds: string[];
}) {
  if (!selectedHangout) return null;

  return (
    <div className="scene">
      {selectedHangout.image ? (
        <img className="sceneArt" src={selectedHangout.image} alt="" />
      ) : (
        <div className="scenePlaceholder">{selectedHangout.name}</div>
      )}
      <div className="sceneWash" aria-hidden="true" />

      {guestIds.map((id, index) => {
        const friend = getFriend(id);
        if (!friend) return null;
        const spot = standingSpot(index, guestIds.length);
        return (
          <div
            className="castFigure attendee"
            key={id}
            style={
              {
                left: `${spot}%`,
                // Standing towards the middle of the room means standing further
                // into it, so the group reads as spread through the space rather
                // than lined up along one wall.
                "--depth": (1 - Math.abs(spot - 50) / 50) * -0.18 + 1,
                // Staggered so the group shifts weight out of sync rather than
                // in lockstep.
                animationDelay: `${index * 0.35}s`,
              } as React.CSSProperties
            }
          >
            <span className="castShadow" aria-hidden="true" />
            <EntityImage
              src={friend.image}
              name={friend.name}
              className="castArt"
            />
          </div>
        );
      })}
    </div>
  );
}

export default HangoutDisplay;

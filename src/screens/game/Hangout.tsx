import { Button } from "@/components/ui/button";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { useActionPoints } from "@/state/gameStateSlice";
import store from "@/state/store";

function HangoutDisplay({
  selectedFriends,
  selectedHangout,
}: {
  selectedFriends: Friend[];
  selectedHangout: Hangout;
}) {
  const { actionPoints } = store.getState();
  // TODO: Add popup with info about failure or points gained out of max
  const startHangout = () => {
    selectedHangout.findFriend();
    selectedFriends.forEach((f) => {
      if (actionPoints <= 1) return;
      if (selectedFriends.length === 0) return;
      useActionPoints(2);
      // friend likes this hangout
      if (f.getLikes().some((p) => p.value == selectedHangout)) {
        f.updateFriendshipLevel(Math.random() * 20 + 10);
      }
      // friend dislikes this hangout
      else if (f.getDislikes().some((p) => p.value == selectedHangout)) {
        f.updateFriendshipLevel(Math.random() * 10);
      }
      // friend is neutral to this hangout
      else {
        f.updateFriendshipLevel(Math.random() * 10 + 10);
      }
    });
  };

  return (
    <>
      <div className="scaleup">
        <div
          className="hangout"
          style={{ backgroundImage: `url(${selectedHangout.image})` }}
        >
          {selectedFriends.map((f) => (
            <div className="friendHolder">
              <img src={f.image} />
            </div>
          ))}
        </div>
      </div>
      {
        <Button onClick={startHangout}>
          Hangout <i>Cost: 2 AP</i>
        </Button>
      }
    </>
  );
}

export default HangoutDisplay;

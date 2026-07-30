import { Button } from "@/components/ui/button";
import FriendSearch from "@/components/ui/friend/friendSearch";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { useActionPoints } from "@/state/gameStateSlice";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import "./Hangout.css";

function HangoutDisplay({
  selectedHangout,
}: {
  selectedHangout: Hangout | undefined;
}) {
  const dispatch = useAppDispatch();
  const friends = useAppSelector((state) => state.friends);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [selectedFriends, setSelectedFriends] = useState([] as Friend[]);
  // TODO: Add popup with info about failure or points gained out of max
  const startHangout = () => {
    selectedHangout?.findFriend();
    selectedFriends.forEach((f) => {
      if (actionPoints <= 1) return;
      if (selectedFriends.length === 0) return;
      dispatch(useActionPoints(2));
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
    selectedHangout && (
      <>
        Hangout with existing friends or find new ones
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
        <FriendSearch
          friends={friends}
          select={true}
          onChange={(friend) => {
            // TODO: handle max friends to hangout properly
            setSelectedFriends([...selectedFriends, friend]);
          }}
        />
        {
          <Button onClick={startHangout}>
            Hangout <i>Cost: 2 AP</i>
          </Button>
        }
      </>
    )
  );
}

export default HangoutDisplay;

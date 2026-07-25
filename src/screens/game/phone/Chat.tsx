import store from "@/state/store";
import FriendSearch from "@/components/ui/friend/friendSearch";
import BackButton from "./BackButton";
import { Button } from "@/components/ui/button";
import type { Friend } from "@/objects/friend";
import { useState } from "react";
import { discoverFriend, useActionPoints } from "@/state/gameStateSlice";

function Chat({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const { friends, actionPoints } = store.getState();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  // TODO: Add popup with info about failure or points gained out of max
  const messageFriend = () => {
    if (actionPoints <= 0) return;
    if (!selectedFriend) return;
    useActionPoints(1);
    selectedFriend.updateFriendshipLevel(Math.random() * 10 + 5); // add 10-5 friendship points
    selectedFriend.introduceFriend();
  };

  return (
    <>
      <div className="screen">
        <div className="header">
          <BackButton setActiveScreen={setActiveScreen} /> Chat
        </div>
        {actionPoints > 0 ? (
          <div>
            <FriendSearch
              friends={friends}
              select={true}
              onChange={setSelectedFriend}
            />
            {selectedFriend && (
              <Button onClick={messageFriend}>
                Send Message to {selectedFriend.name} <i>Cost: 1 AP</i>
              </Button>
            )}
          </div>
        ) : (
          <div>No Action Points Left.</div>
        )}
      </div>
    </>
  );
}

export default Chat;

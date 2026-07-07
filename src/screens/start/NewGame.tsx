import { type Friend, AllFriends } from "../../objects/friend";
import { useState } from "react";
import { setPlayerCharacter } from "../../state/gameStateSlice";
import ScreenHeader from "./ScreenHeader";
import FriendSearch from "@/components/ui/friend/friendSearch";
import { Button } from "@/components/ui/button";

function NewGame({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Friend | null>(
    null,
  );

  const handleConfirmSelection = () => {
    if (selectedCharacter) {
      setPlayerCharacter(selectedCharacter);
      console.log("Selected character:", selectedCharacter);
    }
  };

  return (
    <div>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"New Game"} />
      <h2>Select Your Character</h2>
      <FriendSearch
        friends={AllFriends}
        select={true}
        onChange={setSelectedCharacter}
      />
      <Button
        disabled={selectedCharacter === null}
        onClick={handleConfirmSelection}
      >
        Start Game
      </Button>
    </div>
  );
}

export default NewGame;

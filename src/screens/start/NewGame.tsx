import { type Friend, AllFriends } from "../../objects/friend";
import { useState } from "react";
import { setPlayerCharacter } from "../../state/gameStateSlice";
import ScreenHeader from "./ScreenHeader";
import FriendSelect from "@/components/ui/friend/friendSelect";

function NewGame({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const [selectedCharacter, setSelectedCharacter] = useState<Friend | null>(
    null,
  );

  const handleCharacterSelect = (character: Friend) => {
    setSelectedCharacter(character);
  };

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
      <FriendSelect friends={AllFriends} setFriend={setSelectedCharacter} />
    </div>
  );
}

export default NewGame;

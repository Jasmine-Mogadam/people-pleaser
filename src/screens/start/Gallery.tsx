import FriendSearch from "@/components/ui/friend/friendSearch";
import ScreenHeader from "./ScreenHeader";
import { AllFriends } from "@/objects/catalog";

function Gallery({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"Gallery"} />
      <div>
        {/* Outside a run, so every opinion is shown and friendship is hidden. */}
        <FriendSearch
          friends={AllFriends}
          revealAll={true}
          showFriendship={false}
        />
      </div>
    </>
  );
}
export default Gallery;

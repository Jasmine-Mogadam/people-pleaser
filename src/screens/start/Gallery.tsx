import FriendSearch from "@/components/ui/friend/friendSearch";
import ScreenHeader from "./ScreenHeader";
import { AllFriends } from "@/objects/catalog";
import "./StartMenu.css";

function Gallery({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"Gallery"} />
      <div className="pageBody">
        <p className="mb-4 text-sm text-muted-foreground">
          Every character in the game. Click one to see who drew them and what
          they are into.
        </p>
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

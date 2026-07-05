import FriendSearch from "@/components/ui/friend/friendSearch";
import ScreenHeader from "./ScreenHeader";
import { AllFriends } from "@/objects/friend";

function Gallery({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"Gallery"} />
      <div>
        <FriendSearch friends={AllFriends} />
      </div>
    </>
  );
}
export default Gallery;

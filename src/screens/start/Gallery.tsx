import FriendSearch from "@/components/ui/friend/friendSearch";
import ScreenHeader from "./ScreenHeader";
import { AllFriends } from "@/objects/catalog";
import "./StartMenu.css";

/** Owners in the order their characters first appear in the catalog. */
function owners() {
  const seen: { name: string; url: string }[] = [];
  AllFriends.forEach((friend) => {
    if (!seen.some((o) => o.name === friend.owner)) {
      seen.push({ name: friend.owner, url: friend.ownerUrl });
    }
  });
  return seen;
}

function Gallery({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"Gallery"} />
      <div className="pageBody">
        <p className="mb-4 text-sm">
          Characters owned by{" "}
          {owners().map((owner, index) => (
            <span key={owner.name}>
              {index > 0 && (index === owners().length - 1 ? " and " : ", ")}
              <a href={owner.url} target="_blank" rel="noreferrer">
                {owner.name}
              </a>
            </span>
          ))}
          .
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

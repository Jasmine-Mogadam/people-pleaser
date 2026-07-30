import FriendSearch from "@/components/ui/friend/friendSearch";
import BackButton from "./BackButton";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import { useAppSelector } from "@/state/hooks";

function Contacts({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  // Records hold progress; the catalog holds the character. Join them after the
  // selector, so the selector keeps returning the same array reference.
  const records = useAppSelector((state) => state.friends);
  const met = records
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>Contacts</span>
      </div>
      {met.length === 0 ? (
        <p className="phoneHint">
          Nobody yet. Scroll WormGround, or pick a place on Maps and go alone.
        </p>
      ) : (
        <FriendSearch friends={met} compact={true} />
      )}
    </div>
  );
}

export default Contacts;

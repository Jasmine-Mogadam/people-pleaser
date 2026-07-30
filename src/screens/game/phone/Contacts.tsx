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
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> Contacts
      </div>
      {met.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nobody yet. Try WormGround, or go somewhere and see who turns up.
        </p>
      ) : (
        <FriendSearch friends={met} />
      )}
    </div>
  );
}

export default Contacts;

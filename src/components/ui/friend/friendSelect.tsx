import type { Friend } from "../../../objects/friend";
import { Button } from "@/components/ui/button";
import FriendSearch from "./friendSearch";

function FriendSelect({
  friends,
  setFriend,
}: {
  friends: Friend[];
  setFriend: (friend: Friend) => void;
}) {
  return (
    <>
      <FriendSearch friends={friends} />
      <Button onClick={(e) => setFriend(e.target.value)}>Select</Button>
    </>
  );
}
export default FriendSelect;

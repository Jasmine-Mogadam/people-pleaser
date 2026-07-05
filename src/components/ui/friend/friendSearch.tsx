import type { Friend } from "../../../objects/friend";
import FriendThumb from "./friendThumb";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

function FriendSearch({ friends }: { friends: Friend[] }) {
  const [friendFilter, setFriendFilter] = useState<string>("");
  return (
    <>
      <div>
        <Search />
        <Input onChange={(e) => setFriendFilter(e.target.value)}></Input>
      </div>
      <div>
        {friends
          .filter((f) =>
            f.name.toLowerCase().includes(friendFilter.toLowerCase()),
          )
          .map((f) => (
            <FriendThumb friend={f} key={f.id} />
          ))}
      </div>
    </>
  );
}
export default FriendSearch;

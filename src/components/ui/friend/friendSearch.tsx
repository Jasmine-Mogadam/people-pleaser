import type { Friend } from "../../../objects/friend";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import FriendDialog from "./friendDialog";
import FriendThumb from "./friendThumb";

function FriendSearch({
  friends,
  select = false,
  onChange = () => {},
}: {
  friends: Friend[];
  select?: boolean;
  onChange?: (friend: Friend) => void;
}) {
  const [friendFilter, setFriendFilter] = useState<string>("");
  const [activeId, setActiveId] = useState<number | null>(null);
  return (
    <>
      <div className="flex align-center m-5" style={{ alignItems: "center" }}>
        <Search className="mr-1" />
        <Input
          onChange={(e) => setFriendFilter(e.target.value)}
          placeholder="Character name here..."
        ></Input>
      </div>
      <div>
        {friends
          .filter((f) =>
            f.name.toLowerCase().includes(friendFilter.toLowerCase()),
          )
          .map((f) =>
            select ? (
              <FriendThumb
                friend={f}
                key={f.id}
                onClick={(f) => {
                  onChange(f);
                  setActiveId(f.id);
                }}
                isActive={activeId === f.id}
              />
            ) : (
              <FriendDialog friend={f} key={f.id} />
            ),
          )}
      </div>
    </>
  );
}
export default FriendSearch;

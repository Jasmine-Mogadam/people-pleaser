import type { Friend } from "../../../objects/friend";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FriendDetail from "./friendDetail";

function FriendThumb({ friend }: { friend: Friend }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <img src={friend.image} />
            {friend.name}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <div>
          <FriendDetail friend={friend} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default FriendThumb;

import type { Friend } from "../../../objects/friend";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FriendDetail from "./friendDetail";
import FriendThumb from "./friendThumb";

function FriendDialog({ friend }: { friend: Friend }) {
  return (
    <Dialog>
      <DialogTrigger render={<FriendThumb friend={friend} />} />
      <DialogContent className="sm:max-w-md">
        <div>
          <FriendDetail friend={friend} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default FriendDialog;

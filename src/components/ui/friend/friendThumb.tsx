import type { Friend } from "../../../objects/friend";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FriendDetail from "./friendDetail";

function FriendThumb({ friend }: { friend: Friend }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={`border-3 p-1.5 bg-[url(${friend.image})] w-40 h-40 overflow-hidden relative m-10`}
          >
            <img src={friend.image} width="150px" height="150px" />
            <div
              className="absolute bottom-0 p-1 pl-2 pr-2 m-1"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                borderRadius: "100vh",
                color: "white",
              }}
            >
              {friend.name}
            </div>
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

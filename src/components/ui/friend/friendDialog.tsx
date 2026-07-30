import type { Friend } from "../../../objects/friend";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FriendDetail from "./friendDetail";
import FriendThumb from "./friendThumb";
import { useAppSelector } from "@/state/hooks";

function FriendDialog({
  friend,
  revealAll = false,
  showFriendship = true,
  compact = false,
}: {
  friend: Friend;
  revealAll?: boolean;
  showFriendship?: boolean;
  compact?: boolean;
}) {
  const record = useAppSelector((state) =>
    state.friends.find((f) => f.id === friend.id),
  );

  return (
    <Dialog>
      <DialogTrigger
        render={
          <FriendThumb
            friend={friend}
            compact={compact}
            friendshipLevel={showFriendship ? record?.friendshipLevel : undefined}
          />
        }
      />
      <DialogContent className="sm:max-w-md">
        <FriendDetail
          friend={friend}
          friendshipLevel={showFriendship ? record?.friendshipLevel : undefined}
          discoveredKeys={record?.discoveredPreferences}
          revealAll={revealAll}
        />
      </DialogContent>
    </Dialog>
  );
}
export default FriendDialog;

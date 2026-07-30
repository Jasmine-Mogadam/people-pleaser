import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Friend } from "@/objects/friend";

/**
 * The one interruption worth keeping: meeting somebody new is rare enough that
 * it deserves the whole screen, and the player wants to see who it is.
 */
function NewFriendDialog({
  friend,
  onClose,
}: {
  friend: Friend | null;
  onClose: () => void;
}) {
  if (!friend) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <div className="grid justify-items-center gap-3 text-center">
          <DialogTitle className="text-3xl">Yippie!</DialogTitle>
          <EntityImage
            src={friend.image}
            name={friend.name}
            size={200}
            className="drop-shadow-lg"
          />
          <div className="grid gap-1">
            <div className="text-xl font-semibold text-foreground">
              {friend.name}
            </div>
            <div>
              <Badge variant="outline">{friend.personality}</Badge>
            </div>
            <a
              href={friend.ownerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs"
            >
              owned by {friend.owner}
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            They are in your contacts now.
          </p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button className="w-full">Nice</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewFriendDialog;

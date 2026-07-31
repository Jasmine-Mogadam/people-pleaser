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
        {/* Short screens have to be able to see the title, so the portrait
            gives up height before the text does. */}
        <div className="grid max-h-[80vh] justify-items-center gap-3 overflow-y-auto text-center">
          <DialogTitle className="text-2xl">
            You befriended {friend.name}
          </DialogTitle>
          <EntityImage
            src={friend.image}
            name={friend.name}
            className="h-[min(200px,32vh)] w-auto drop-shadow-lg"
          />
          <div className="grid gap-1">
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
          <DialogClose render={<Button className="w-full">Yippie!</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewFriendDialog;

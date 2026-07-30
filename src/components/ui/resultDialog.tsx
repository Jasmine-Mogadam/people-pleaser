import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { InteractionResult } from "@/game/interactions";

/**
 * The feedback popup for every action: what you gained out of what was
 * possible, which modifiers applied, and what went wrong if it failed.
 */
function ResultDialog({
  result,
  onClose,
}: {
  result: InteractionResult | null;
  onClose: () => void;
}) {
  if (!result) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {result.ok ? result.title : `${result.title} — nothing happened`}
          </DialogTitle>
          {result.message && (
            <DialogDescription>{result.message}</DialogDescription>
          )}
        </DialogHeader>

        {result.ok && (
          <div className="grid gap-3">
            {result.gains.map((gain) => {
              const percent =
                gain.max > 0
                  ? Math.max(0, Math.min(100, (gain.gained / gain.max) * 100))
                  : 0;
              return (
                <div key={gain.friendId} className="grid gap-1">
                  <div className="flex justify-between font-medium">
                    <span>{gain.name}</span>
                    <span>
                      {gain.gained >= 0 ? "+" : ""}
                      {gain.gained} / {gain.max} possible
                    </span>
                  </div>
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    role="meter"
                    aria-valuenow={gain.gained}
                    aria-valuemin={0}
                    aria-valuemax={gain.max}
                    aria-label={`Friendship gained with ${gain.name}`}
                  >
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {gain.reasons.length > 0 && (
                    <ul className="text-xs text-muted-foreground">
                      {gain.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {(result.apSpent > 0 || result.moneySpent > 0) && (
              <div className="text-xs text-muted-foreground">
                Spent {result.apSpent} AP
                {result.moneySpent > 0 && ` and $${result.moneySpent}`}.
              </div>
            )}

            {result.metFriend && (
              <div className="font-medium">
                New contact: {result.metFriend}.
              </div>
            )}

            {result.learned.map((note) => (
              <div key={note} className="text-sm">
                {note}
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button>Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResultDialog;

import { Button } from "@/components/ui/button";
import FriendSearch from "@/components/ui/friend/friendSearch";
import EntityImage from "@/components/ui/entityImage";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { startHangout, visitAlone } from "@/game/interactions";
import { toastFromResult } from "@/game/resultToast";
import { useToast } from "@/components/ui/toastContext";
import { ActionPointCost } from "@/game/rules";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";
import "./Hangout.css";

function HangoutDisplay({
  selectedHangout,
  onDone,
}: {
  selectedHangout: Hangout | undefined;
  onDone: () => void;
}) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const friendRecords = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!selectedHangout) return null;

  const met = friendRecords
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));

  // Capacity is enforced here and again in startHangout, so neither the UI nor a
  // stale click can overfill a venue.
  const toggle = (friend: Friend) => {
    setSelectedIds((current) =>
      current.includes(friend.id)
        ? current.filter((id) => id !== friend.id)
        : current.length >= selectedHangout.capacity
          ? current
          : [...current, friend.id],
    );
  };

  const cost = selectedHangout.costPerPerson * selectedIds.length;

  const go = () => {
    const outcome = startHangout(
      dispatch,
      store.getState(),
      selectedHangout.id,
      selectedIds,
    );
    toast(toastFromResult(outcome));
    if (outcome.ok) setSelectedIds([]);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <h1 className="sceneTitle">{selectedHangout.name}</h1>
        <p className="sceneMeta">{selectedHangout.description}</p>
        <p className="sceneMeta">
          Fits {selectedHangout.capacity} · ${selectedHangout.costPerPerson} per
          person · {ActionPointCost.Hangout} AP
        </p>
      </div>

      <div
        className="scene"
        style={
          selectedHangout.image
            ? { backgroundImage: `url(${selectedHangout.image})` }
            : undefined
        }
      >
        {!selectedHangout.image && (
          <div className="scenePlaceholder">{selectedHangout.name}</div>
        )}
        <div className="attendees">
          {selectedIds.map((id) => {
            const friend = getFriend(id);
            if (!friend) return null;
            return (
              <div className="attendee" key={id}>
                <EntityImage src={friend.image} name={friend.name} size={110} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={go}
          disabled={
            selectedIds.length === 0 ||
            actionPoints < ActionPointCost.Hangout ||
            cost > money
          }
        >
          Hang out · {ActionPointCost.Hangout} AP{cost > 0 && `, $${cost}`}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast(
              toastFromResult(
                visitAlone(dispatch, store.getState(), selectedHangout.id),
              ),
            )
          }
          disabled={
            actionPoints < ActionPointCost.SoloVisit ||
            selectedHangout.costPerPerson > money
          }
        >
          Go alone · {ActionPointCost.SoloVisit} AP
          {selectedHangout.costPerPerson > 0 &&
            `, $${selectedHangout.costPerPerson}`}
        </Button>
        <Button variant="ghost" onClick={onDone}>
          Go home
        </Button>
      </div>

      {actionPoints < ActionPointCost.SoloVisit && (
        <p className="text-sm text-destructive">
          No action points left this week.
        </p>
      )}

      {met.length === 0 ? (
        <p className="sceneMeta">
          Nobody to invite yet. Go alone and see who turns up, or try WormGround
          on your phone.
        </p>
      ) : (
        <FriendSearch
          friends={met}
          select={true}
          selectedIds={selectedIds}
          maxSelected={selectedHangout.capacity}
          onToggle={toggle}
        />
      )}
    </div>
  );
}

export default HangoutDisplay;

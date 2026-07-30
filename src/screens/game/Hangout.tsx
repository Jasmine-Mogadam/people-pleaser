import { Button } from "@/components/ui/button";
import FriendSearch from "@/components/ui/friend/friendSearch";
import EntityImage from "@/components/ui/entityImage";
import ResultDialog from "@/components/ui/resultDialog";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { startHangout, type InteractionResult } from "@/game/interactions";
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
  const friendRecords = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [result, setResult] = useState<InteractionResult | null>(null);

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
    setResult(outcome);
    if (outcome.ok) setSelectedIds([]);
  };

  return (
    <>
      <div className="p-3">
        <h1 className="text-lg font-semibold">{selectedHangout.name}</h1>
        <p className="text-sm text-muted-foreground">
          {selectedHangout.description}
        </p>
        <p className="text-sm">
          Fits {selectedHangout.capacity} · ${selectedHangout.costPerPerson} per
          person · {ActionPointCost.Hangout} AP
        </p>
      </div>

      <div className="scaleup">
        <div
          className="hangout"
          style={
            selectedHangout.image
              ? { backgroundImage: `url(${selectedHangout.image})` }
              : undefined
          }
        >
          {!selectedHangout.image && (
            <div className="hangoutPlaceholder">{selectedHangout.name}</div>
          )}
          <div className="attendees">
            {selectedIds.map((id) => {
              const friend = getFriend(id);
              if (!friend) return null;
              return (
                <div className="friendHolder" key={id}>
                  <EntityImage src={friend.image} name={friend.name} size={90} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {met.length === 0 ? (
        <p className="p-3 text-sm text-muted-foreground">
          You have not met anybody to invite yet. Try WormGround on your phone.
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

      <div className="flex flex-wrap items-center gap-3 p-3">
        <Button
          onClick={go}
          disabled={
            selectedIds.length === 0 ||
            actionPoints < ActionPointCost.Hangout ||
            cost > money
          }
        >
          Hangout{" "}
          <i>
            Cost: {ActionPointCost.Hangout} AP, ${cost}
          </i>
        </Button>
        <Button variant="outline" onClick={onDone}>
          Go home
        </Button>
        {actionPoints < ActionPointCost.Hangout && (
          <span className="text-sm text-destructive">
            Not enough action points this week.
          </span>
        )}
        {cost > money && (
          <span className="text-sm text-destructive">
            That costs ${cost} and you have ${Math.round(money)}.
          </span>
        )}
      </div>

      <ResultDialog result={result} onClose={() => setResult(null)} />
    </>
  );
}

export default HangoutDisplay;

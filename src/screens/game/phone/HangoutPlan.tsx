import { Button } from "@/components/ui/button";
import FriendSearch from "@/components/ui/friend/friendSearch";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { startHangout, visitAlone } from "@/game/interactions";
import { knownPreference } from "@/game/preferences";
import { toastFromResult } from "@/game/resultToast";
import { useAnnounce } from "@/game/useAnnounce";
import { ActionPointCost } from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/**
 * Everything you decide before actually going out: who is invited, what it will
 * cost, and whether to commit. It lives under Maps rather than on the venue
 * itself, so the scene behind stays a view of the place with your guest list
 * filling in as you pick people.
 */
function HangoutPlan({
  hangout,
  guestIds,
  onToggleGuest,
  onGoHome,
}: {
  hangout: Hangout;
  guestIds: string[];
  onToggleGuest: (id: string) => void;
  onGoHome: () => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const friendRecords = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const met = friendRecords
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));

  // Taking somebody somewhere they hate is a real mistake, so the picker says so
  // -- for the places you have found out they care about, at least.
  const opinionOf = (friend: Friend) => {
    const record = friendRecords.find((r) => r.id === friend.id);
    return record
      ? knownPreference(friend, hangout, record.discoveredPreferences)
      : null;
  };

  const cost = hangout.costPerPerson * guestIds.length;

  const go = () => {
    const outcome = startHangout(
      dispatch,
      store.getState(),
      hangout.id,
      guestIds,
    );
    // The guest list is left as it was: going out with the same group again is
    // the common case, and re-picking everybody each time was busywork.
    announce(toastFromResult(outcome));
  };

  return (
    <div className="screen">
      <p className="phoneHint">{hangout.description}</p>

      <dl className="statList">
        <dt>Fits</dt>
        <dd>{hangout.capacity}</dd>
        <dt>Per person</dt>
        <dd>${hangout.costPerPerson}</dd>
        <dt>Going out costs</dt>
        <dd>{ActionPointCost.Hangout} AP</dd>
      </dl>

      <div className="grid gap-2">
        <Button
          onClick={go}
          disabled={
            guestIds.length === 0 ||
            actionPoints < ActionPointCost.Hangout ||
            cost > money
          }
        >
          Hang out · {ActionPointCost.Hangout} AP{cost > 0 && `, $${cost}`}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            announce(
              toastFromResult(
                visitAlone(dispatch, store.getState(), hangout.id),
              ),
            )
          }
          disabled={
            actionPoints < ActionPointCost.SoloVisit ||
            hangout.costPerPerson > money
          }
        >
          Go alone · {ActionPointCost.SoloVisit} AP
          {hangout.costPerPerson > 0 && `, $${hangout.costPerPerson}`}
        </Button>
        <Button variant="ghost" onClick={onGoHome}>
          Go home
        </Button>
      </div>

      {actionPoints < ActionPointCost.SoloVisit && (
        <p className="text-xs text-destructive">
          No action points left this week.
        </p>
      )}

      {met.length === 0 ? (
        <p className="phoneHint">
          Nobody to invite yet. Go alone and see who turns up, or try WormGround.
        </p>
      ) : (
        <FriendSearch
          friends={met}
          select={true}
          compact={true}
          selectedIds={guestIds}
          maxSelected={hangout.capacity}
          preferenceFor={opinionOf}
          onToggle={(friend) => onToggleGuest(friend.id)}
        />
      )}
    </div>
  );
}

export default HangoutPlan;

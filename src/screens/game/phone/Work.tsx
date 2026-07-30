import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { workOvertime } from "@/game/interactions";
import { useAnnounce } from "@/game/useAnnounce";
import {
  ActionPointCost,
  OVERTIME_PAY,
  SHIFTS_PER_PROMOTION,
  weeklySalary,
} from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/**
 * The salary arrives every week no matter what. Overtime trades an action point
 * for cash right now, and enough shifts earn a raise that pays out every week.
 * The raise count is deliberately not shown -- just experience filling up.
 */
function Work({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const job = useAppSelector((state) => state.job);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const progress = Math.min(1, job.shiftsWorked / SHIFTS_PER_PROMOTION);

  const doShift = () => {
    const result = workOvertime(dispatch, store.getState());
    announce({
      title: result.ok ? `Overtime · +$${result.earned}` : "Work",
      tone: result.ok ? "default" : "error",
      message: result.message,
    });
  };

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>Work</span>
      </div>

      <dl className="statList">
        <dt>Weekly paycheck</dt>
        <dd>${weeklySalary(job)}</dd>
      </dl>

      <div className="grid gap-1">
        <span className="text-sm">Experience</span>
        <div
          className="xpBar"
          role="meter"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Experience toward your next raise"
        >
          <div className="xpFill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <p className="phoneHint">
        An overtime shift pays ${OVERTIME_PAY + job.promotions * 10} straight
        away and costs {ActionPointCost.Overtime} AP. Enough experience earns a
        bigger paycheck.
      </p>

      <Button onClick={doShift} disabled={actionPoints < ActionPointCost.Overtime}>
        Work overtime ({ActionPointCost.Overtime} AP)
      </Button>

      {actionPoints < ActionPointCost.Overtime && (
        <p className="phoneHint">No action points left this week.</p>
      )}
    </div>
  );
}

export default Work;

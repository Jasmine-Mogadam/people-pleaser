import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { workOvertime } from "@/game/interactions";
import { useToast } from "@/components/ui/toastContext";
import {
  ActionPointCost,
  MAX_PROMOTIONS,
  OVERTIME_PAY,
  SHIFTS_PER_PROMOTION,
  weeklySalary,
} from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/**
 * The salary arrives every week no matter what. Overtime trades an action point
 * for cash right now, and enough shifts earn a raise that pays out every week.
 */
function Work({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const job = useAppSelector((state) => state.job);
  const upgrades = useAppSelector((state) => state.upgrades);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const atMax = job.promotions >= MAX_PROMOTIONS;

  const doShift = () => {
    const result = workOvertime(dispatch, store.getState());
    toast({
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
        <dd>${weeklySalary(job, upgrades)}</dd>
        <dt>Promotions</dt>
        <dd>
          {job.promotions} / {MAX_PROMOTIONS}
        </dd>
        <dt>Shifts until a raise</dt>
        <dd>
          {atMax ? "—" : `${job.shiftsWorked} / ${SHIFTS_PER_PROMOTION}`}
        </dd>
      </dl>

      <p className="phoneHint">
        An overtime shift pays ${OVERTIME_PAY + job.promotions * 10} straight
        away and costs {ActionPointCost.Overtime} AP.
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

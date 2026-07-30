import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { workOvertime, type WorkResult } from "@/game/interactions";
import {
  ActionPointCost,
  MAX_PROMOTIONS,
  OVERTIME_PAY,
  SHIFTS_PER_PROMOTION,
  weeklySalary,
} from "@/game/rules";
import { useState } from "react";
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
  const job = useAppSelector((state) => state.job);
  const upgrades = useAppSelector((state) => state.upgrades);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [result, setResult] = useState<WorkResult | null>(null);

  const atMax = job.promotions >= MAX_PROMOTIONS;

  return (
    <div className="screen">
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> Work
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Weekly paycheck</dt>
        <dd>${weeklySalary(job, upgrades)}</dd>
        <dt className="text-muted-foreground">Promotions</dt>
        <dd>
          {job.promotions} / {MAX_PROMOTIONS}
        </dd>
        <dt className="text-muted-foreground">Shifts toward next raise</dt>
        <dd>
          {atMax ? "—" : `${job.shiftsWorked} / ${SHIFTS_PER_PROMOTION}`}
        </dd>
      </dl>

      <p className="text-sm text-muted-foreground">
        An overtime shift pays ${OVERTIME_PAY + job.promotions * 10} now and costs{" "}
        {ActionPointCost.Overtime} AP.
      </p>

      <Button
        onClick={() => setResult(workOvertime(dispatch, store.getState()))}
        disabled={actionPoints < ActionPointCost.Overtime}
      >
        Work overtime ({ActionPointCost.Overtime} AP)
      </Button>

      {actionPoints < ActionPointCost.Overtime && (
        <p className="text-sm text-destructive">No action points left.</p>
      )}
      {result && (
        <p className={`text-sm ${result.ok ? "" : "text-destructive"}`} role="status">
          {result.ok && `Earned $${result.earned}. `}
          {result.message}
        </p>
      )}
    </div>
  );
}

export default Work;

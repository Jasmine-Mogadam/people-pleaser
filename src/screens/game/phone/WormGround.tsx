import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { browseWormGround } from "@/game/interactions";
import { toastFromResult } from "@/game/resultToast";
import { useToast } from "@/components/ui/toastContext";
import { ActionPointCost } from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/** Social media. One action point buys a roll at a new place or a new person. */
function WormGround({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const actionPoints = useAppSelector((state) => state.actionPoints);

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>WormGround</span>
      </div>
      <p className="phoneHint">
        Scrolling costs {ActionPointCost.Browse} AP. It might turn up a new
        place, a new person, or nothing at all.
      </p>
      <Button
        onClick={() =>
          toast(toastFromResult(browseWormGround(dispatch, store.getState())))
        }
        disabled={actionPoints < ActionPointCost.Browse}
      >
        Scroll ({ActionPointCost.Browse} AP)
      </Button>
      {actionPoints < ActionPointCost.Browse && (
        <p className="phoneHint">No action points left this week.</p>
      )}
    </div>
  );
}

export default WormGround;

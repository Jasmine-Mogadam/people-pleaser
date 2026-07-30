import { Button } from "@/components/ui/button";
import ResultDialog from "@/components/ui/resultDialog";
import BackButton from "./BackButton";
import { browseWormGround, type InteractionResult } from "@/game/interactions";
import { ActionPointCost } from "@/game/rules";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/** Social media. One action point buys a roll at a new place or a new person. */
function WormGround({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [result, setResult] = useState<InteractionResult | null>(null);

  return (
    <div className="screen">
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> WormGround
      </div>
      <p className="text-sm text-muted-foreground">
        Scrolling costs {ActionPointCost.Browse} AP. Roughly 40% of scrolls turn
        up a new place, 30% turn up a new person, and the rest turn up nothing.
      </p>
      <Button
        onClick={() => setResult(browseWormGround(dispatch, store.getState()))}
        disabled={actionPoints < ActionPointCost.Browse}
      >
        Scroll ({ActionPointCost.Browse} AP)
      </Button>
      {actionPoints < ActionPointCost.Browse && (
        <p className="text-sm text-destructive">No action points left.</p>
      )}
      <ResultDialog result={result} onClose={() => setResult(null)} />
    </div>
  );
}

export default WormGround;

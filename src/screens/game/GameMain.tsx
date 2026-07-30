import { Button } from "@/components/ui/button";
import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import Ending from "./Ending";
import { useEffect, useState } from "react";
import type { Hangout as HangoutType } from "@/objects/hangout";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";
import { saveGameState } from "@/state/gameState";
import { advanceWeek, type WeekReport } from "@/game/interactions";
import { FRIEND_THRESHOLD, GAME_LENGTH_WEEKS, isGameOver } from "@/game/rules";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function GameMain({
  setActiveScreen: setMenuScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const friends = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const currentWeek = useAppSelector((state) => state.currentWeek);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const [activeScreen, setActiveScreen] = useState(ScreenEnum.House);
  const [selectedHangout, setSelectedHangout] = useState(
    undefined as HangoutType | undefined,
  );
  const [weekReport, setWeekReport] = useState<WeekReport | null>(null);

  const realFriends = friends.filter(
    (f) => f.friendshipLevel >= FRIEND_THRESHOLD,
  ).length;

  // Autosave. Subscribing to the store catches every change, including the ones
  // that happen inside interaction handlers rather than during a render.
  useEffect(() => store.subscribe(saveGameState), []);

  const endWeek = () => {
    setWeekReport(advanceWeek(dispatch, store.getState()));
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return (
          <Hangout
            selectedHangout={selectedHangout}
            onDone={() => setActiveScreen(ScreenEnum.House)}
          />
        );
    }
  };

  if (isGameOver(currentWeek)) {
    return <Ending onExit={() => setMenuScreen("Main")} />;
  }

  return (
    <>
      <div className="header flex flex-wrap items-center gap-4 p-3">
        <div className="date">
          Week {currentWeek + 1} of {GAME_LENGTH_WEEKS}
        </div>
        <div className="money">${Math.round(money)}</div>
        <div className="friends">
          {realFriends} {realFriends === 1 ? "Friend" : "Friends"}
        </div>
        <div className="actions">{actionPoints} AP</div>
        <Button onClick={endWeek}>
          {actionPoints > 0 ? `End Week (${actionPoints} AP left)` : "End Week"}
        </Button>
      </div>

      <Phone
        setActiveScreen={setActiveScreen}
        setSelectedHangout={setSelectedHangout}
      />
      {renderScreen()}

      <Dialog
        open={weekReport !== null}
        onOpenChange={(open) => !open && setWeekReport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Week {weekReport?.week}</DialogTitle>
            <DialogDescription>
              Paycheck ${weekReport?.salary}. Action points refilled to{" "}
              {weekReport?.actionPoints}.
            </DialogDescription>
          </DialogHeader>
          {weekReport && weekReport.roommateGains.length > 0 && (
            <div className="text-sm">
              <div className="font-medium">Roommates</div>
              <div className="text-muted-foreground">
                {weekReport.roommateGains.join(", ")}
              </div>
            </div>
          )}
          {weekReport && weekReport.drifted.length > 0 && (
            <div className="text-sm">
              <div className="font-medium">
                Drifted apart (nobody heard from you)
              </div>
              <div className="text-muted-foreground">
                {weekReport.drifted.join(", ")}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button>Continue</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GameMain;

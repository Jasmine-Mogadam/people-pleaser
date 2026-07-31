import { Button } from "@/components/ui/button";
import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import Ending from "./Ending";
import NewFriendDialog from "@/components/ui/newFriendDialog";
import { useEffect, useRef, useState } from "react";
import type { Hangout as HangoutType } from "@/objects/hangout";
import type { Friend } from "@/objects/friend";
import { getFriend } from "@/objects/catalog";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";
import { saveGameState } from "@/state/gameState";
import { advanceWeek } from "@/game/interactions";
import { useAnnounce } from "@/game/useAnnounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CalendarDays, CircleDollarSign, Users, Zap } from "lucide-react";
import { FRIEND_THRESHOLD, GAME_LENGTH_WEEKS, isGameOver } from "@/game/rules";
import "./GameMain.css";

function GameMain({
  setActiveScreen: setMenuScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const friends = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const currentWeek = useAppSelector((state) => state.currentWeek);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const [activeScreen, setActiveScreen] = useState(ScreenEnum.House);
  const [selectedHangout, setSelectedHangout] = useState(
    undefined as HangoutType | undefined,
  );
  const [pendingInvite, setPendingInvite] = useState<string | null>(null);
  const [newFriend, setNewFriend] = useState<Friend | null>(null);
  const [confirmEndWeek, setConfirmEndWeek] = useState(false);

  const realFriends = friends.filter(
    (f) => f.friendshipLevel >= FRIEND_THRESHOLD,
  ).length;

  // Autosave. Subscribing to the store catches every change, including the ones
  // that happen inside interaction handlers rather than during a render.
  useEffect(() => store.subscribe(saveGameState), []);

  // Meeting someone can happen from a chat, a hangout, a solo visit or a scroll.
  // Watching the roster here means the celebration works for all of them.
  const knownCount = useRef(friends.length);
  useEffect(() => {
    if (friends.length > knownCount.current) {
      const latest = friends[friends.length - 1];
      setNewFriend(getFriend(latest.id) ?? null);
    }
    knownCount.current = friends.length;
  }, [friends]);

  const endWeek = () => {
    setConfirmEndWeek(false);
    const report = advanceWeek(dispatch, store.getState());
    if (isGameOver(report.week)) return;
    announce({
      title: `Week ${report.week + 1}`,
      message: `Paycheck $${report.salary}. Action points back to ${report.actionPoints}.`,
      notes: [
        ...report.givenBack,
        report.roommateGains.length > 0
          ? `Roommates: ${report.roommateGains.join(", ")}`
          : "",
        report.drifted.length > 0
          ? `Drifted apart: ${report.drifted.join(", ")}`
          : "",
      ].filter(Boolean),
    });
  };

  // Unspent action points are gone for good, so make the player say so out loud.
  const requestEndWeek = () => {
    if (actionPoints > 0) setConfirmEndWeek(true);
    else endWeek();
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return (
          <Hangout
            key={`${selectedHangout?.id ?? ""}-${pendingInvite ?? ""}`}
            selectedHangout={selectedHangout}
            initialInvite={pendingInvite}
            onDone={() => {
              setPendingInvite(null);
              setActiveScreen(ScreenEnum.House);
            }}
          />
        );
    }
  };

  if (isGameOver(currentWeek)) {
    return <Ending onExit={() => setMenuScreen("Main")} />;
  }

  return (
    <div className="gameLayout">
      <header className="gameHeader">
        <span className="stat">
          <CalendarDays className="statIcon" />
          Week {currentWeek + 1}
          <span className="statMuted">/ {GAME_LENGTH_WEEKS}</span>
        </span>
        <span className="stat">
          <CircleDollarSign className="statIcon" />${Math.round(money)}
        </span>
        <span className="stat">
          <Users className="statIcon" />
          {realFriends} {realFriends === 1 ? "Friend" : "Friends"}
        </span>
        <span className="stat">
          <Zap className="statIcon" />
          {actionPoints} AP
        </span>
        <Button className="endWeek" onClick={requestEndWeek}>
          End Week
        </Button>
      </header>

      <main className="gameStage">{renderScreen()}</main>

      <Phone
        setActiveScreen={setActiveScreen}
        setSelectedHangout={setSelectedHangout}
        onInvite={setPendingInvite}
      />

      <NewFriendDialog friend={newFriend} onClose={() => setNewFriend(null)} />

      <Dialog open={confirmEndWeek} onOpenChange={setConfirmEndWeek}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>End the week early?</DialogTitle>
            <DialogDescription>
              You still have {actionPoints} action point
              {actionPoints === 1 ? "" : "s"} left. They do not carry over to
              next week.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Keep playing</Button>}
            />
            <Button onClick={endWeek}>End week anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GameMain;

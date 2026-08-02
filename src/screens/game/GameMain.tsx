import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import Ending from "./Ending";
import { useEffect, useRef, useState } from "react";
import type { Hangout as HangoutType } from "@/objects/hangout";
import type { Friend } from "@/objects/friend";
import { getFriend } from "@/objects/catalog";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";
import { saveGameState } from "@/state/gameState";
import { advanceWeek } from "@/game/interactions";
import { useAnnounce } from "@/game/useAnnounce";
import { isGameOver } from "@/game/rules";
import "./GameMain.css";

function GameMain({
  setActiveScreen: setMenuScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const friends = useAppSelector((state) => state.friends);
  const currentWeek = useAppSelector((state) => state.currentWeek);

  const [activeScreen, setActiveScreen] = useState(ScreenEnum.House);
  const [selectedHangout, setSelectedHangout] = useState(
    undefined as HangoutType | undefined,
  );
  // Who is coming along. Owned here rather than by the venue, because the phone
  // is where the guest list is built and the scene is where it is drawn.
  const [guestIds, setGuestIds] = useState<string[]>([]);
  const [newFriend, setNewFriend] = useState<Friend | null>(null);

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

  // Picking a smaller venue cannot silently take more people than fit in it.
  const chooseHangout = (hangout: HangoutType) => {
    setSelectedHangout(hangout);
    setGuestIds((current) => current.slice(0, hangout.capacity));
  };

  // Capacity is enforced here and again in startHangout, so neither the UI nor a
  // stale click can overfill a venue.
  const toggleGuest = (id: string) =>
    setGuestIds((current) =>
      current.includes(id)
        ? current.filter((guest) => guest !== id)
        : current.length >= (selectedHangout?.capacity ?? 0)
          ? current
          : [...current, id],
    );

  const goHome = () => {
    setGuestIds([]);
    setActiveScreen(ScreenEnum.House);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return (
          <Hangout selectedHangout={selectedHangout} guestIds={guestIds} />
        );
    }
  };

  if (isGameOver(currentWeek)) {
    return <Ending onExit={() => setMenuScreen("Main")} />;
  }

  return (
    <div className="gameLayout">
      <main className="gameStage">{renderScreen()}</main>

      {/* Week, money and action points live on the handset now: the phone is
          how you spend a week, so it is where the week is counted. */}
      <Phone
        setActiveScreen={setActiveScreen}
        atVenue={activeScreen === ScreenEnum.Hangout}
        selectedHangout={selectedHangout}
        onChooseHangout={chooseHangout}
        guestIds={guestIds}
        onToggleGuest={toggleGuest}
        onInvite={(friendId) => setGuestIds(friendId ? [friendId] : [])}
        onGoHome={goHome}
        onEndWeek={endWeek}
        newFriend={newFriend}
        onDismissNewFriend={() => setNewFriend(null)}
      />

    </div>
  );
}

export default GameMain;

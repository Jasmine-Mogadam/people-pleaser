import { Button } from "@/components/ui/button";
import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import { useState } from "react";
import type { Hangout as HangoutType } from "@/objects/hangout";
import { nextWeek, setActionPoints } from "@/state/gameStateSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";

function GameMain() {
  const friends = useAppSelector((state) => state.friends);
  const money = useAppSelector((state) => state.money);
  const currentWeek = useAppSelector((state) => state.currentWeek);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return <Hangout selectedHangout={selectedHangout} />;
    }
  };
  const dispatch = useAppDispatch();
  const [activeScreen, setActiveScreen] = useState(ScreenEnum.House);
  const [selectedHangout, setSelectedHangout] = useState(
    undefined as HangoutType | undefined,
  );

  return (
    <>
      <div className="header">
        <div className="date">Week {currentWeek}</div>
        <div className="money">${money.toPrecision(3)}</div>
        <div className="friends">
          {friends.filter((f) => f.friendshipLevel > 0.5).length} Friends
        </div>
        <div className="actions">{actionPoints} AP</div>
        <Button
          onClick={() => {
            dispatch(nextWeek());
            // TODO: shop upgrades increase action points per week
            dispatch(setActionPoints(5));
          }}
        >
          Next Week
        </Button>
      </div>
      <Phone
        setActiveScreen={setActiveScreen}
        setSelectedHangout={setSelectedHangout}
      ></Phone>
      {renderScreen()}
    </>
  );
}

export default GameMain;

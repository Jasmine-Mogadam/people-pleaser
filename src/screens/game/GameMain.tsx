import { Button } from "@/components/ui/button";
import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import { useState } from "react";
import type { Hangout as HangoutType } from "@/objects/hangout";
import { nextWeek, setActionPoints } from "@/state/gameStateSlice";
import { useDispatch, useSelector } from "react-redux";

function GameMain() {
  const friends = useSelector((state) => state.friends);
  const money = useSelector((state) => state.money);
  const currentWeek = useSelector((state) => state.currentWeek);
  const actionPoints = useSelector((state) => state.actionPoints);

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return <Hangout selectedHangout={selectedHangout} />;
    }
  };
  const dispatch = useDispatch();
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

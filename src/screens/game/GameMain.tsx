import { Button } from "@/components/ui/button";
import store from "@/state/store";
import { ScreenEnum } from "./screenEnum";
import House from "./House";
import Hangout from "./Hangout";
import Phone from "./Phone";
import { useState } from "react";

function GameMain() {
  const { friends, money } = store.getState();

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.House:
        return <House />;
      case ScreenEnum.Hangout:
        return <Hangout />;
    }
  };
  const [activeScreen, setActiveScreen] = useState(ScreenEnum.House);
  return (
    <>
      <div className="header">
        <div className="date">Date WIP</div>
        <div className="money">{money}</div>
        <div className="friends">
          {friends.filter((f) => f.friendshipLevel > 0.5).length}
        </div>
        <div className="actions">Actions Left WIP</div>
        <Button>Next Week</Button>
      </div>
      <Phone setActiveScreen={setActiveScreen}></Phone>
      {renderScreen()}
    </>
  );
}

export default GameMain;

import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import Main from "./Main";
import NewGame from "./NewGame";
import About from "./About";
import Gallery from "./Gallery";

function StartMenu() {
  const [activeScreen, setActiveScreen] = useState(ScreenEnum.Main);

  const renderScreen = () => {
    switch (activeScreen) {
      case ScreenEnum.Main:
        return <Main setActiveScreen={setActiveScreen} />;
      case ScreenEnum.NewGame:
        return <NewGame setActiveScreen={setActiveScreen} />;
      case ScreenEnum.Gallery:
        return <Gallery setActiveScreen={setActiveScreen} />;
      case ScreenEnum.About:
        return <About setActiveScreen={setActiveScreen} />;
    }
  };
  return <>{renderScreen()}</>;
}

export default StartMenu;

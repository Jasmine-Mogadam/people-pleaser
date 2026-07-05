import "./StartMenu.css";
import { hasGameData } from "../../state/gameState";
import { ScreenEnum } from "./screenEnum";
import { Button } from "@/components/ui/button";

function StartMenu({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <section id="center">
        <div className="hero">
          <h1>People Pleaser</h1>
        </div>
        <div className="menu">
          <Button
            className="Continue"
            onClick={() => setActiveScreen(ScreenEnum.Game)}
            disabled={!hasGameData()}
          >
            Continue
          </Button>
          <Button
            className="StartNewGame"
            onClick={() => setActiveScreen(ScreenEnum.NewGame)}
          >
            Start New Game
          </Button>
          <Button
            className="Gallery"
            onClick={() => setActiveScreen(ScreenEnum.Gallery)}
          >
            Gallery
          </Button>
          <Button
            className="About"
            onClick={() => setActiveScreen(ScreenEnum.About)}
          >
            About
          </Button>
        </div>
      </section>
      <section id="spacer"></section>
    </>
  );
}

export default StartMenu;

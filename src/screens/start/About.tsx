import { Link } from "lucide-react";
import ScreenHeader from "./ScreenHeader";
import "./StartMenu.css";

function About({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"About"} />
      <div className="pageBody grid max-w-2xl gap-4">
        <div>Made by PinkFlamess for ArtFight</div>
        <div>
          This is the version of the game with the code made by ai. The art and
          the characters are still all mine. The version made entirely by hand,
          with no ai involved, is here:
          <div className="linkList">
            <a href="https://people-pleaser.netlify.app/">
              people-pleaser.netlify.app <Link className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          Check out my other games!
          <div className="linkList">
            <a href="https://the-fish-tank.netlify.app">
              The Fish Tank <Link className="h-4 w-4" />
            </a>
            <a href="https://scribble-beasts.com">
              Scribble Beasts <Link className="h-4 w-4" />
            </a>
            <a href="https://thegrandbazaar.quest">
              The Grand Bazaar <Link className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
export default About;

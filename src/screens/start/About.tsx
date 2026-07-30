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
          Life happened and I didn't really do as much as I hoped. This game was
          made entirely by hand. If you want to see more of what I was going for,
          you can see a more fleshed out version of the game here: (note, this alt
          version had ai used to make the code)
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

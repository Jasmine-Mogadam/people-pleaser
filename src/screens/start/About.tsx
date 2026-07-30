import { Link } from "lucide-react";
import ScreenHeader from "./ScreenHeader";

function About({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <ScreenHeader setActiveScreen={setActiveScreen} title={"About"} />
      <div>Made by PinkFlamess for ArtFight</div>
      <div>
        Life happened and I didn't really do as much as I hoped. This game was
        made entirely by hand. If you want to see more of what I was going for,
        you can see a more fleshed out version of the game here: (note, this alt
        version had ai used to make the code)
        <a href="https://people-pleaserr.netlify.app/">
          People Pleaser (AI assisted) <Link />
        </a>
      </div>
      <div>
        Check out my other games!
        <div>
          <a href="https://the-fish-tank.netlify.app">
            The Fish Tank <Link />
          </a>
          <a href="https://scribble-beasts.com">
            Scribble Beasts <Link />
          </a>
          <a href="https://thegrandbazaar.quest">
            The Grand Bazaar <Link />
          </a>
        </div>
      </div>
    </>
  );
}
export default About;

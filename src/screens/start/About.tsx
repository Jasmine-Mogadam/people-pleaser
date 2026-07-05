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
      <div>Hope you enjoyed my little game</div>
      <div>
        Check out my other games!
        <div>
          <a href="https://the-fish-tank.netlify.app">The Fish Tank</a>
          <a href="https://scribble-beasts.com">Scribble Beasts</a>
          <a href="https://thegrandbazaar.quest">The Grand Bazaar</a>
        </div>
      </div>
    </>
  );
}
export default About;

import heroImg from "./assets/hero.png";
import "./StartMenu.css";
import { hasGameData } from "./state/storageManager";

function StartMenu() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <h1>People Pleaser</h1>
        </div>
        <div className="menu">
          <button
            type="button"
            className="Continue"
            onClick={() => console.log("Continue")}
            disabled={!hasGameData()}
          >
            Continue
          </button>
          <button
            type="button"
            className="StartNewGame"
            onClick={() => console.log("Start New Game")}
          >
            Start New Game
          </button>
          <button
            type="button"
            className="Gallery"
            onClick={() => console.log("Gallery")}
          >
            Gallery
          </button>
          <button
            type="button"
            className="About"
            onClick={() => console.log("About")}
          >
            About
          </button>
        </div>
      </section>
      <section id="spacer"></section>
    </>
  );
}

export default StartMenu;

import "./StartMenu.css";
import { hasGameData, newGameState } from "../../state/gameState";
import { ScreenEnum } from "./screenEnum";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

function StartMenu({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const startNewGame = () => {
    newGameState();
    setActiveScreen(ScreenEnum.Game);
  };
  return (
    <>
      <section id="center">
        <div className="hero">
          <h1>People Pleaser</h1>
        </div>
        <div className="menu">
          <Button
            className="Continue"
            onClick={startNewGame}
            disabled={!hasGameData()}
          >
            Continue
          </Button>
          {hasGameData() ? (
            <Dialog>
              <DialogTrigger className="StartNewGame">New Game</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your save and lose all your friends! D:
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button
                    type="submit"
                    className="StartNewGame"
                    onClick={startNewGame}
                  >
                    Start New Game
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button className="StartNewGame" onClick={startNewGame}>
              Start New Game
            </Button>
          )}
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

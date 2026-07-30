import "./StartMenu.css";
import { hasGameData, loadGameState, newGameState } from "../../state/gameState";
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
import { useState } from "react";
import { GAME_LENGTH_WEEKS } from "@/game/rules";

function StartMenu({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const [loadError, setLoadError] = useState<string | null>(null);

  const startNewGame = () => {
    newGameState();
    setActiveScreen(ScreenEnum.Game);
  };

  // Continue used to call startNewGame, which wiped the save it was meant to load.
  const continueGame = () => {
    if (loadGameState()) {
      setActiveScreen(ScreenEnum.Game);
    } else {
      setLoadError("That save could not be read. Starting a new game will replace it.");
    }
  };

  return (
    <>
      <section id="center">
        <div className="hero">
          <h1>People Pleaser</h1>
        </div>
        <p className="tagline">
          You have {GAME_LENGTH_WEEKS} weeks and a handful of action points each
          week. Spend them on people.
        </p>
        <div className="menu">
          <Button
            className="Continue"
            onClick={continueGame}
            disabled={!hasGameData()}
          >
            Continue
          </Button>
          {hasGameData() ? (
            <Dialog>
              <DialogTrigger
                render={<Button variant="outline">New Game</Button>}
              />
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
            <Button onClick={startNewGame}>Start New Game</Button>
          )}
          <Button
            variant="outline"
            onClick={() => setActiveScreen(ScreenEnum.Gallery)}
          >
            Gallery
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveScreen(ScreenEnum.About)}
          >
            About
          </Button>
        </div>
        {loadError && (
          <p role="alert" className="text-sm text-destructive">
            {loadError}
          </p>
        )}
      </section>
      <section id="spacer"></section>
    </>
  );
}

export default StartMenu;

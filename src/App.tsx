import { useEffect } from "react";
import "./App.css";
import StartMenu from "./screens/start/StartMenu";
import { loadGameState, saveGameState } from "./state/gameState";
import store from "./state/store";

function App() {
  loadGameState();
  const {
    inventory,
    friends,
    money,
    house,
    discoveredHangouts,
    playerCharacter,
  } = store.getState();

  // autosave
  useEffect(() => {
    saveGameState();
  }, [inventory, friends, money, house, discoveredHangouts, playerCharacter]);
  return (
    <>
      <StartMenu />
    </>
  );
}

export default App;

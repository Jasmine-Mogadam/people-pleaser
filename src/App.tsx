import "./App.css";
import StartMenu from "./StartMenu";
import { loadState } from "./state/storageManager";

loadState();
function App() {
  return (
    <>
      <StartMenu />
    </>
  );
}

export default App;

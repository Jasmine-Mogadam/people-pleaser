import { useEffect } from "react";
import "./App.css";
import StartMenu from "./screens/start/StartMenu";
import { useAppSelector } from "./state/hooks";

function App() {
  const settings = useAppSelector((state) => state.settings);

  // Accessibility settings live on <html> so plain CSS can react to them.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("reduced-motion", settings.reducedMotion);
    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("large-text", settings.largeText);
  }, [settings]);

  return <StartMenu />;
}

export default App;

import { Button } from "@/components/ui/button";
import BackButton from "./BackButton";
import { toggleSetting, type SettingsState } from "@/state/gameStateSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";

const options: {
  key: keyof SettingsState;
  label: string;
  description: string;
}[] = [
  {
    key: "reducedMotion",
    label: "Reduce motion",
    description: "Turns off transitions and animations.",
  },
  {
    key: "highContrast",
    label: "High contrast",
    description: "Stronger borders and text contrast.",
  },
  {
    key: "largeText",
    label: "Larger text",
    description: "Increases the base font size across the game.",
  },
];

function Settings({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className="screen">
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> Settings
      </div>
      <div className="grid gap-2">
        {options.map((option) => (
          <Button
            key={option.key}
            variant={settings[option.key] ? "default" : "outline"}
            aria-pressed={settings[option.key]}
            className="h-auto justify-start py-2 text-left"
            onClick={() => dispatch(toggleSetting(option.key))}
          >
            <span className="grid">
              <span>
                {option.label} — {settings[option.key] ? "On" : "Off"}
              </span>
              <span className="text-xs opacity-80">{option.description}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Settings;

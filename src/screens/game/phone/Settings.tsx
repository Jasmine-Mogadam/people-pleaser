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
  {
    key: "dyslexiaFont",
    label: "Dyslexia-friendly font",
    description: "Switches everything to OpenDyslexic.",
  },
];

function Settings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className="screen">
      <div className="grid gap-1.5">
        {options.map((option) => (
          <button
            key={option.key}
            className="toggleRow"
            role="switch"
            aria-checked={settings[option.key]}
            onClick={() => dispatch(toggleSetting(option.key))}
          >
            <span className="rowText">
              <span className="rowTitle">{option.label}</span>
              <span className="rowMeta">{option.description}</span>
            </span>
            <span
              className={`switch ${settings[option.key] ? "switchOn" : ""}`}
              aria-hidden="true"
            >
              <span className="switchKnob" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Settings;

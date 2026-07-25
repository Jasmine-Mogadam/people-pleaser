import { ArrowLeft } from "lucide-react";
import { PhoneScreenEnum } from "./PhoneScreenEnum";
function BackButton({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  return (
    <>
      <button
        className="back"
        onClick={() => setActiveScreen(PhoneScreenEnum.Main)}
      >
        <ArrowLeft></ArrowLeft>
      </button>
    </>
  );
}

export default BackButton;

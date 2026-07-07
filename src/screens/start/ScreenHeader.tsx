import { ArrowLeftIcon } from "lucide-react";
import { ScreenEnum } from "./screenEnum";
function ScreenHeader({
  setActiveScreen,
  title,
}: {
  setActiveScreen: (screen: string) => void;
  title: string;
}) {
  return (
    <>
      <div className="flex align-center m-5" style={{ alignItems: "center" }}>
        <ArrowLeftIcon
          className="h-6 w-6 mr-5 h-10 w-10"
          onClick={() => setActiveScreen(ScreenEnum.Main)}
        />
        <h1>{title}</h1>
      </div>
    </>
  );
}

export default ScreenHeader;

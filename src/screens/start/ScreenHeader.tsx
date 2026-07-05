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
      <div>
        <ArrowLeftIcon
          className="h-6 w-6"
          onClick={() => setActiveScreen(ScreenEnum.Main)}
        />
        <h1>{title}</h1>
      </div>
    </>
  );
}

export default ScreenHeader;

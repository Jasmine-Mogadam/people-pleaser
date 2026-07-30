import { ArrowLeftIcon } from "lucide-react";
import { ScreenEnum } from "./screenEnum";
import { Button } from "@/components/ui/button";

function ScreenHeader({
  setActiveScreen,
  title,
}: {
  setActiveScreen: (screen: string) => void;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 p-5">
      <Button
        variant="outline"
        size="icon"
        aria-label="Back to menu"
        onClick={() => setActiveScreen(ScreenEnum.Main)}
      >
        <ArrowLeftIcon />
      </Button>
      <h1 className="m-0 text-2xl">{title}</h1>
    </div>
  );
}

export default ScreenHeader;

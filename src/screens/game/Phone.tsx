import "./Phone.css";
import { Button } from "@/components/ui/button";
import store from "@/state/store";
import { MapPin, MessageCircle, Settings, User2, Worm } from "lucide-react";
import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import { PhoneScreenEnum } from "./phone/PhoneScreenEnum";
import Contacts from "./phone/Contacts";
import Chat from "./phone/Chat";
import BackButton from "./phone/BackButton";

function Phone({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const { discoveredHangouts } = store.getState();

  const renderScreen = () => {
    switch (activePhoneScreen) {
      case PhoneScreenEnum.Main:
        return (
          <>
            <Button
              className="contracts"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.Contacts)}
            >
              <User2 />
              Contacts
            </Button>
            <Button
              className="chat"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.Chat)}
            >
              <MessageCircle />
              Chat
            </Button>
            <Button
              className="maps"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.Maps)}
            >
              <MapPin />
              Maps
            </Button>
            <Button
              className="wormground"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.WormGround)}
            >
              <Worm />
              WormGround
            </Button>
            <Button
              className="settings"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.Settings)}
            >
              <Settings />
              Settings
            </Button>
          </>
        );
      case PhoneScreenEnum.Contacts:
        return (
          <>
            <Contacts setActiveScreen={setActivePhoneScreen} />
          </>
        );
      case PhoneScreenEnum.Chat:
        return <Chat setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Maps:
        return (
          <>
            <BackButton
              setActiveScreen={() => setActivePhoneScreen(PhoneScreenEnum.Main)}
            />{" "}
            Maps
            {discoveredHangouts.map((h) => (
              <Button
                key={h.name}
                onClick={() => setActiveScreen(ScreenEnum.Hangout)}
              >
                {h.name}
              </Button>
            ))}
          </>
        );
      default:
        return (
          <>
            <BackButton
              setActiveScreen={() => setActivePhoneScreen(PhoneScreenEnum.Main)}
            />{" "}
            Not Implemented :(
          </>
        );
    }
  };
  const [activePhoneScreen, setActivePhoneScreen] = useState(
    PhoneScreenEnum.Main,
  );

  return (
    <>
      <div className="phone">
        <div className="draggable"></div>
        <div className="close"></div>
        {renderScreen()}
      </div>
    </>
  );
}

export default Phone;

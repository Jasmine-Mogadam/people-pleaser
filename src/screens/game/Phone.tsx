import "./Phone.css";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, Settings, User2, Worm } from "lucide-react";
import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import { PhoneScreenEnum } from "./phone/PhoneScreenEnum";
import Contacts from "./phone/Contacts";
import Chat from "./phone/Chat";
import BackButton from "./phone/BackButton";
import { AllHangouts, type Hangout } from "@/objects/hangout";

function Phone({
  setActiveScreen,
  setSelectedHangout,
}: {
  setActiveScreen: (screen: string) => void;
  setSelectedHangout: (hangout: Hangout) => void;
}) {
  const renderScreen = () => {
    switch (activePhoneScreen) {
      // TODO: Add shoppinh and work screens to get and spend money. You always get a base salary, but working can get promotions to get more + overtime for money now
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
              {/* TODO: fake social media where 1 AP gets a roll for a new hangout or friend*/}
              <Worm />
              WormGround
            </Button>
            <Button
              className="settings"
              onClick={() => setActivePhoneScreen(PhoneScreenEnum.Settings)}
            >
              {/*TODO: accessibility settings*/}
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
            {
              // TODO: only use discovered hangouts and slowly unlock more from talking with friends
              AllHangouts.map((h) => (
                <Button
                  key={h.name}
                  onClick={() => {
                    setSelectedHangout(h);
                    setActiveScreen(ScreenEnum.Hangout);
                  }}
                >
                  {h.name}
                </Button>
              ))
            }
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

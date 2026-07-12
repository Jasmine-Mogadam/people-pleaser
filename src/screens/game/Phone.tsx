import { Button } from "@/components/ui/button";
import store from "@/state/store";
import { MapPin, MessageCircle, User2, Worm } from "lucide-react";
import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import FriendSearch from "@/components/ui/friend/friendSearch";

function Phone({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const {
    inventory,
    friends,
    money,
    house,
    discoveredHangouts,
    playerCharacter,
  } = store.getState();

  const PhoneScreenEnum = {
    Main: "Main",
    Contacts: "Contacts",
    Chat: "Chat", // find out more about existing friends
    Maps: "Maps", // hangout planning
    WormGround: "WormGround ", // social media, allows player to find new people
    Settings: "Settings", // accessibility
  };
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
              <Worm />
              Settings
            </Button>
          </>
        );
      case PhoneScreenEnum.Contacts:
        return (
          <>
            <FriendSearch friends={friends} />
          </>
        );
      case PhoneScreenEnum.Chat:
        return <></>;
      case PhoneScreenEnum.Maps:
        return (
          <>
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
      case PhoneScreenEnum.Settings:
        return <>WIP</>;
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

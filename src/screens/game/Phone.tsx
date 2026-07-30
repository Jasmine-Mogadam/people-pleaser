import "./Phone.css";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MapPin,
  MessageCircle,
  Settings as SettingsIcon,
  ShoppingBag,
  User2,
  Worm,
} from "lucide-react";
import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import { PhoneScreenEnum } from "./phone/PhoneScreenEnum";
import Contacts from "./phone/Contacts";
import Chat from "./phone/Chat";
import Shop from "./phone/Shop";
import Work from "./phone/Work";
import WormGround from "./phone/WormGround";
import Settings from "./phone/Settings";
import BackButton from "./phone/BackButton";
import EntityImage from "@/components/ui/entityImage";
import { getHangout } from "@/objects/catalog";
import type { Hangout } from "@/objects/hangout";
import { useAppSelector } from "@/state/hooks";

const apps = [
  { screen: PhoneScreenEnum.Contacts, label: "Contacts", icon: User2, className: "contacts" },
  { screen: PhoneScreenEnum.Chat, label: "Chat", icon: MessageCircle, className: "chat" },
  { screen: PhoneScreenEnum.Maps, label: "Maps", icon: MapPin, className: "maps" },
  { screen: PhoneScreenEnum.WormGround, label: "WormGround", icon: Worm, className: "wormground" },
  { screen: PhoneScreenEnum.Shop, label: "Shop", icon: ShoppingBag, className: "shop" },
  { screen: PhoneScreenEnum.Work, label: "Work", icon: Briefcase, className: "work" },
  { screen: PhoneScreenEnum.Settings, label: "Settings", icon: SettingsIcon, className: "settings" },
];

function Phone({
  setActiveScreen,
  setSelectedHangout,
}: {
  setActiveScreen: (screen: string) => void;
  setSelectedHangout: (hangout: Hangout) => void;
}) {
  const [activePhoneScreen, setActivePhoneScreen] = useState(
    PhoneScreenEnum.Main,
  );
  const discoveredHangouts = useAppSelector((state) => state.discoveredHangouts);

  const goHome = () => setActivePhoneScreen(PhoneScreenEnum.Main);

  const renderScreen = () => {
    switch (activePhoneScreen) {
      case PhoneScreenEnum.Main:
        return (
          <>
            {apps.map((app) => (
              <Button
                key={app.screen}
                className={app.className}
                onClick={() => setActivePhoneScreen(app.screen)}
              >
                <app.icon />
                {app.label}
              </Button>
            ))}
          </>
        );
      case PhoneScreenEnum.Contacts:
        return <Contacts setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Chat:
        return <Chat setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Shop:
        return <Shop setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Work:
        return <Work setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.WormGround:
        return <WormGround setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Settings:
        return <Settings setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Maps:
        return (
          <div className="screen">
            <div className="header">
              <BackButton setActiveScreen={goHome} /> Maps
            </div>
            {/* Only places you have actually heard about. Friends mention their
                favourites when you chat, and WormGround turns up the rest. */}
            {discoveredHangouts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No places saved yet. Chat with people or scroll WormGround to
                find some.
              </p>
            ) : (
              <div className="grid gap-1">
                {discoveredHangouts.map((id) => {
                  const hangout = getHangout(id);
                  if (!hangout) return null;
                  return (
                    <Button
                      key={hangout.id}
                      variant="outline"
                      className="h-auto justify-start py-2"
                      onClick={() => {
                        setSelectedHangout(hangout);
                        setActiveScreen(ScreenEnum.Hangout);
                        goHome();
                      }}
                    >
                      <EntityImage
                        src={hangout.image}
                        name={hangout.name}
                        size={32}
                      />
                      <span className="grid text-left">
                        <span>{hangout.name}</span>
                        <span className="text-xs opacity-80">
                          fits {hangout.capacity} · ${hangout.costPerPerson} each
                        </span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        );
      default:
        return (
          <>
            <BackButton setActiveScreen={goHome} /> Not Implemented :(
          </>
        );
    }
  };

  return (
    <div className="phone">
      <div className="draggable"></div>
      <div className="close"></div>
      {renderScreen()}
    </div>
  );
}

export default Phone;

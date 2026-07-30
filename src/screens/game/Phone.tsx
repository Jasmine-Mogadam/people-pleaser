import "./Phone.css";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ChevronDown,
  History as HistoryIcon,
  MapPin,
  Settings as SettingsIcon,
  ShoppingBag,
  User2,
  Worm,
} from "lucide-react";
import { useState } from "react";
import { ScreenEnum } from "./screenEnum";
import { PhoneScreenEnum } from "./phone/PhoneScreenEnum";
import Contacts from "./phone/Contacts";
import Shop from "./phone/Shop";
import Work from "./phone/Work";
import WormGround from "./phone/WormGround";
import Settings from "./phone/Settings";
import History from "./phone/History";
import BackButton from "./phone/BackButton";
import EntityImage from "@/components/ui/entityImage";
import { getHangout } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { useAppSelector } from "@/state/hooks";

const apps = [
  { screen: PhoneScreenEnum.Contacts, label: "Contacts", icon: User2 },
  { screen: PhoneScreenEnum.Maps, label: "Maps", icon: MapPin },
  { screen: PhoneScreenEnum.WormGround, label: "WormGround", icon: Worm },
  { screen: PhoneScreenEnum.Shop, label: "Shop", icon: ShoppingBag },
  { screen: PhoneScreenEnum.Work, label: "Work", icon: Briefcase },
  { screen: PhoneScreenEnum.History, label: "History", icon: HistoryIcon },
  { screen: PhoneScreenEnum.Settings, label: "Settings", icon: SettingsIcon },
];

function Phone({
  setActiveScreen,
  setSelectedHangout,
  onInvite,
}: {
  setActiveScreen: (screen: string) => void;
  setSelectedHangout: (hangout: Hangout) => void;
  /** Carries somebody from Contacts through to the hangout they get invited to. */
  onInvite: (friendId: string | null) => void;
}) {
  // Starts closed so the scene is unobstructed until the player reaches for it.
  const [open, setOpen] = useState(false);
  const [activePhoneScreen, setActivePhoneScreen] = useState(
    PhoneScreenEnum.Main,
  );
  const discoveredHangouts = useAppSelector((state) => state.discoveredHangouts);
  const actionPoints = useAppSelector((state) => state.actionPoints);

  const goHome = () => setActivePhoneScreen(PhoneScreenEnum.Main);

  // Picking somebody in Contacts sends you to Maps to choose where to take them.
  const planHangout = (friend: Friend) => {
    onInvite(friend.id);
    setActivePhoneScreen(PhoneScreenEnum.Maps);
  };

  const renderScreen = () => {
    switch (activePhoneScreen) {
      case PhoneScreenEnum.Main:
        return (
          <div className="appGrid">
            {apps.map((app) => (
              <button
                key={app.screen}
                className="appIcon"
                onClick={() => setActivePhoneScreen(app.screen)}
              >
                <span className="appGlyph">
                  <app.icon />
                </span>
                <span className="appLabel">{app.label}</span>
              </button>
            ))}
          </div>
        );
      case PhoneScreenEnum.Contacts:
        return (
          <Contacts
            setActiveScreen={setActivePhoneScreen}
            onPlanHangout={planHangout}
          />
        );
      case PhoneScreenEnum.Shop:
        return <Shop setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Work:
        return <Work setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.WormGround:
        return <WormGround setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.History:
        return <History setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Settings:
        return <Settings setActiveScreen={setActivePhoneScreen} />;
      case PhoneScreenEnum.Maps:
        return (
          <div className="screen">
            <div className="screenHeader">
              <BackButton setActiveScreen={goHome} />
              <span>Maps</span>
            </div>
            {/* Only places you have actually heard about. Friends mention their
                favourites when you chat, and WormGround turns up the rest. */}
            {discoveredHangouts.length === 0 ? (
              <p className="phoneHint">
                No places saved yet. Chat with people or scroll WormGround to
                find some.
              </p>
            ) : (
              <div className="grid gap-1.5">
                {discoveredHangouts.map((id) => {
                  const hangout = getHangout(id);
                  if (!hangout) return null;
                  return (
                    <Button
                      key={hangout.id}
                      variant="outline"
                      className="listRow"
                      onClick={() => {
                        setSelectedHangout(hangout);
                        setActiveScreen(ScreenEnum.Hangout);
                        setOpen(false);
                        goHome();
                      }}
                    >
                      <EntityImage
                        src={hangout.image}
                        name={hangout.name}
                        size={34}
                      />
                      <span className="rowText">
                        <span className="rowTitle">{hangout.name}</span>
                        <span className="rowMeta">
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
          <div className="screen">
            <div className="screenHeader">
              <BackButton setActiveScreen={goHome} />
              <span>Not Implemented :(</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`phoneShell ${open ? "isOpen" : "isClosed"}`}>
      <button
        className="phoneHandle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="phone-body"
      >
        <span className="phoneSpeaker" aria-hidden="true" />
        <span className="handleLabel">Phone</span>
        <span className="handleMeta">
          {actionPoints} AP
          <ChevronDown className="handleChevron h-4 w-4" />
        </span>
      </button>

      <div className="phoneBody" id="phone-body" aria-hidden={!open}>
        <div className="phoneScreen">{renderScreen()}</div>
        <span className="homeBar" aria-hidden="true" />
      </div>
    </div>
  );
}

export default Phone;

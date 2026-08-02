import "./Phone.css";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Briefcase,
  History as HistoryIcon,
  House as HouseIcon,
  MapPin,
  Settings as SettingsIcon,
  ShoppingBag,
  User2,
  Worm,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScreenEnum } from "./screenEnum";
import { PhoneScreenEnum } from "./phone/PhoneScreenEnum";
import Contacts from "./phone/Contacts";
import FriendProfile from "./phone/FriendProfile";
import HangoutPlan from "./phone/HangoutPlan";
import Home from "./phone/Home";
import Maps from "./phone/Maps";
import NewFriend from "./phone/NewFriend";
import PhoneOverlay from "./phone/PhoneOverlay";
import Shop from "./phone/Shop";
import Work from "./phone/Work";
import WormGround from "./phone/WormGround";
import Settings from "./phone/Settings";
import History from "./phone/History";
import { CLOSE_MS, playPickup, restTransform } from "./phone/pickup";
import { PhoneNotice } from "@/components/ui/toast";
import { getFriend } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Hangout } from "@/objects/hangout";
import { weeklyActionPoints } from "@/game/rules";
import { useAppSelector } from "@/state/hooks";

const apps = [
  { screen: PhoneScreenEnum.Contacts, label: "Contacts", icon: User2 },
  { screen: PhoneScreenEnum.Home, label: "Home", icon: HouseIcon },
  { screen: PhoneScreenEnum.Maps, label: "Maps", icon: MapPin },
  { screen: PhoneScreenEnum.WormGround, label: "WormGround", icon: Worm },
  { screen: PhoneScreenEnum.Shop, label: "Shop", icon: ShoppingBag },
  { screen: PhoneScreenEnum.Work, label: "Work", icon: Briefcase },
  { screen: PhoneScreenEnum.History, label: "History", icon: HistoryIcon },
  { screen: PhoneScreenEnum.Settings, label: "Settings", icon: SettingsIcon },
];

/** Battery turns red at the point where most actions are out of reach. */
const LOW_BATTERY = 0.34;

/** Which way the screen behind the header just moved, for the transition. */
type Motion = "forward" | "back" | "home";

function Phone({
  setActiveScreen,
  atVenue,
  selectedHangout,
  onChooseHangout,
  guestIds,
  onToggleGuest,
  onInvite,
  onGoHome,
  onEndWeek,
  newFriend,
  onDismissNewFriend,
}: {
  setActiveScreen: (screen: string) => void;
  /** Whether the player is currently out somewhere rather than at home. */
  atVenue: boolean;
  selectedHangout: Hangout | undefined;
  onChooseHangout: (hangout: Hangout) => void;
  guestIds: string[];
  onToggleGuest: (friendId: string) => void;
  /** Carries somebody from their profile through to the place they get taken. */
  onInvite: (friendId: string | null) => void;
  /** Going home, from wherever you were. */
  onGoHome: () => void;
  onEndWeek: () => void;
  /** Somebody just met, worth stopping everything for. */
  newFriend: Friend | null;
  onDismissNewFriend: () => void;
}) {
  // Starts put away so the scene is unobstructed until the player reaches for it.
  const [open, setOpen] = useState(false);
  // Meeting somebody takes the phone's screen over, so the handset has to be up
  // to show it. Every way of meeting somebody is already something you did on
  // the phone, but deriving it means the celebration can never happen out of
  // sight -- and cannot be dismissed by putting the phone down either.
  const up = open || newFriend !== null;
  // A stack rather than a single screen: the shell draws one back button for
  // every app, so it has to know where back goes.
  const [nav, setNav] = useState<{ stack: string[]; motion: Motion }>({
    stack: [PhoneScreenEnum.Main],
    motion: "home",
  });
  const [openFriendId, setOpenFriendId] = useState<string | null>(null);
  const [confirmEndWeek, setConfirmEndWeek] = useState(false);

  const actionPoints = useAppSelector((state) => state.actionPoints);
  const upgrades = useAppSelector((state) => state.upgrades);
  const money = useAppSelector((state) => state.money);
  const currentWeek = useAppSelector((state) => state.currentWeek);
  const reducedMotion = useAppSelector((state) => state.settings.reducedMotion);

  const handsetRef = useRef<HTMLDivElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Which pose the handset was last left in. Null until the first pass, so the
  // phone starts put away rather than animating itself down on arrival.
  const posed = useRef<boolean | null>(null);

  const screen = nav.stack[nav.stack.length - 1];
  const isHome = screen === PhoneScreenEnum.Main;
  const openFriend = openFriendId ? getFriend(openFriendId) : undefined;

  const goHome = useCallback(
    () => setNav({ stack: [PhoneScreenEnum.Main], motion: "home" }),
    [],
  );
  const push = (next: string) =>
    setNav((current) => ({
      stack: [...current.stack, next],
      motion: "forward",
    }));
  const goBack = () =>
    setNav((current) =>
      current.stack.length > 1
        ? { stack: current.stack.slice(0, -1), motion: "back" }
        : current,
    );

  const closePhone = useCallback(() => {
    // Somebody new is on the screen. That one gets acknowledged.
    if (newFriend) return;
    setOpen(false);
    // Held until the handset is down: resetting immediately would flash the home
    // screen through the glass on the way out.
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(goHome, CLOSE_MS);
  }, [goHome, newFriend]);

  const openPhone = useCallback(() => {
    // Picking the phone straight back up keeps you where you were, so the
    // pending reset from the last close has to be called off.
    clearTimeout(resetTimer.current);
    setOpen(true);
  }, []);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  // The swing is written straight to the element, so it lives in an effect
  // rather than in the render. Only an actual change of pose is worth animating;
  // arriving, re-running, and reduced motion all just snap into place.
  useEffect(() => {
    const el = handsetRef.current;
    if (!el) return;
    const was = posed.current;
    posed.current = up;
    if (was === null || was === up || reducedMotion) {
      el.style.transform = restTransform(el.offsetHeight, up);
      return;
    }
    return playPickup(el, up);
  }, [up, reducedMotion]);

  const openFriendScreen = (id: string) => {
    setOpenFriendId(id);
    push(PhoneScreenEnum.Friend);
  };

  // Picking somebody sends you to Maps to choose where to take them, and they
  // are already on the guest list when you get there.
  const planHangout = (friendId: string) => {
    onInvite(friendId);
    push(PhoneScreenEnum.Maps);
  };

  // Choosing a place puts you there straight away, with whoever is coming
  // already standing in the scene, and drops you on the plan for it.
  const chooseHangout = (hangout: Hangout) => {
    onChooseHangout(hangout);
    setActiveScreen(ScreenEnum.Hangout);
    push(PhoneScreenEnum.Plan);
  };

  const openApp = (target: string) => {
    // Opening Maps while you are already out puts you back on the plan for where
    // you are, rather than making you find the place on the list again.
    if (target === PhoneScreenEnum.Maps && atVenue && selectedHangout) {
      setNav({
        stack: [PhoneScreenEnum.Main, PhoneScreenEnum.Maps, PhoneScreenEnum.Plan],
        motion: "forward",
      });
      return;
    }
    // Opening Home is how you actually get home -- looking at your place and
    // being there are the same thing.
    if (target === PhoneScreenEnum.Home) onGoHome();
    push(target);
  };

  // Unspent action points are gone for good, so make the player say so out loud.
  const requestEndWeek = () => {
    if (actionPoints > 0) setConfirmEndWeek(true);
    else onEndWeek();
  };

  const screenTitle = () => {
    if (isHome) return "People Pleaser";
    if (screen === PhoneScreenEnum.Friend) return openFriend?.name ?? "Contact";
    if (screen === PhoneScreenEnum.Plan) return selectedHangout?.name ?? "Plan";
    return screen;
  };

  const renderScreen = () => {
    switch (screen) {
      case PhoneScreenEnum.Main:
        return (
          <div className="homeScreen">
            <div className="appGrid">
              {apps.map((app) => (
                <button
                  key={app.screen}
                  className="appIcon"
                  onClick={() => openApp(app.screen)}
                >
                  <span className="appGlyph">
                    <app.icon />
                  </span>
                  <span className="appLabel">{app.label}</span>
                </button>
              ))}
            </div>
            <div className="homeFooter">
              <Button className="nextWeek" onClick={requestEndWeek}>
                Next Week
              </Button>
            </div>
          </div>
        );
      case PhoneScreenEnum.Home:
        return <Home />;
      case PhoneScreenEnum.Contacts:
        return <Contacts onOpenFriend={openFriendScreen} />;
      case PhoneScreenEnum.Friend:
        return openFriend ? (
          <FriendProfile
            friend={openFriend}
            onPlanHangout={() => planHangout(openFriend.id)}
          />
        ) : null;
      case PhoneScreenEnum.Shop:
        return <Shop />;
      case PhoneScreenEnum.Work:
        return <Work />;
      case PhoneScreenEnum.WormGround:
        return <WormGround />;
      case PhoneScreenEnum.History:
        return <History />;
      case PhoneScreenEnum.Settings:
        return <Settings />;
      case PhoneScreenEnum.Maps:
        return <Maps guestIds={guestIds} onChoose={chooseHangout} />;
      case PhoneScreenEnum.Plan:
        return selectedHangout ? (
          <HangoutPlan
            hangout={selectedHangout}
            guestIds={guestIds}
            onToggleGuest={onToggleGuest}
            onGoHome={() => {
              onGoHome();
              goBack();
            }}
          />
        ) : null;
      default:
        return (
          <div className="screen">
            <p className="phoneHint">Not Implemented :(</p>
          </div>
        );
    }
  };

  const charge = Math.max(
    0,
    Math.min(1, actionPoints / weeklyActionPoints(upgrades)),
  );

  return (
    <div className="phoneLayer">
      <div
        className={`phoneScrim ${up ? "isOpen" : ""}`}
        onClick={closePhone}
        aria-hidden="true"
      />

      <div className="phoneSheet">
        {/* Meeting somebody is its own celebration; a banner sliding over the
            top of it would be two interruptions for one event. */}
        {!newFriend && <PhoneNotice away={!up} />}

        <div
          className="phoneHandset"
          ref={handsetRef}
          // Putting away is deliberate (the chrome, the close button, the scrim);
          // picking up only takes a tap anywhere on the handset.
          onClick={up ? undefined : openPhone}
        >
          <button
            className="phoneChrome"
            aria-expanded={up}
            aria-controls="phone-screen"
            aria-label={up ? "Put the phone away" : "Pick up the phone"}
            onClick={(event) => {
              event.stopPropagation();
              if (up) closePhone();
              else openPhone();
            }}
          >
            <span className="phoneGrip" aria-hidden="true" />
            <span className="phoneStatus">
              <span className="statusWeek">Week {currentWeek + 1}</span>
              <span className="statusMoney">${Math.round(money)}</span>
              <span className={`statusAp ${charge <= LOW_BATTERY ? "isLow" : ""}`}>
                {actionPoints} AP
                <span className="battery" aria-hidden="true">
                  <span
                    className="batteryFill"
                    style={{ width: `${charge * 100}%` }}
                  />
                </span>
              </span>
            </span>
          </button>

          <div
            className="phoneGlass"
            id="phone-screen"
            inert={!up}
            aria-hidden={!up}
          >
            {isHome ? (
              <button
                className="phoneIconButton phoneCloseFloating"
                onClick={closePhone}
                aria-label="Put the phone away"
              >
                <X />
              </button>
            ) : (
              <div className="phoneTopBar">
                <button
                  className="phoneIconButton"
                  onClick={goBack}
                  aria-label="Back"
                >
                  <ArrowLeft />
                </button>
                <span className="phoneTitle">{screenTitle()}</span>
                <button
                  className="phoneIconButton"
                  onClick={closePhone}
                  aria-label="Put the phone away"
                >
                  <X />
                </button>
              </div>
            )}

            <div className="phoneScreenBody" key={screen} data-motion={nav.motion}>
              {renderScreen()}
            </div>

            <NewFriend friend={newFriend} onClose={onDismissNewFriend} />

            {confirmEndWeek && (
              <PhoneOverlay
                label="End the week early?"
                onClose={() => setConfirmEndWeek(false)}
                actions={
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setConfirmEndWeek(false)}
                    >
                      Keep playing
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setConfirmEndWeek(false);
                        onEndWeek();
                      }}
                    >
                      End week anyway
                    </Button>
                  </>
                }
              >
                <h2 className="overlayTitle">End the week early?</h2>
                <p className="phoneHint">
                  You still have {actionPoints} action point
                  {actionPoints === 1 ? "" : "s"} left. They do not carry over to
                  next week.
                </p>
              </PhoneOverlay>
            )}
          </div>

          <span className="homeBar" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default Phone;

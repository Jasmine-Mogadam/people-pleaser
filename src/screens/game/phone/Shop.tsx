import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import BackButton from "./BackButton";
import { AllGifts } from "@/objects/catalog";
import { AllHouses, getHouse } from "@/objects/house";
import { AllUpgrades, getUpgrade } from "@/objects/upgrade";
import { buyGift, moveHouse, purchaseUpgrade } from "@/game/interactions";
import { useToast } from "@/components/ui/toastContext";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

const Tab = { Gifts: "Gifts", Upgrades: "Upgrades", Housing: "Housing" };

function Shop({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const money = useAppSelector((state) => state.money);
  const inventory = useAppSelector((state) => state.inventory);
  const upgrades = useAppSelector((state) => state.upgrades);
  const houseState = useAppSelector((state) => state.house);
  const [tab, setTab] = useState(Tab.Gifts);

  const owned = (giftId: string) => inventory.filter((id) => id === giftId).length;

  // Purchases either work or explain why not, so the toast tone follows the
  // money changing rather than the message text.
  const buy = (title: string, run: () => string) => {
    const before = store.getState().money;
    const message = run();
    toast({
      title,
      message,
      tone: store.getState().money === before ? "error" : "default",
    });
  };

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>Shop</span>
        <span className="headerMoney">${Math.round(money)}</span>
      </div>

      <div className="tabRow">
        {Object.values(Tab).map((name) => (
          <Button
            key={name}
            size="sm"
            variant={tab === name ? "default" : "outline"}
            onClick={() => setTab(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      {tab === Tab.Gifts && (
        <div className="grid gap-1.5">
          <p className="phoneHint">
            Gifts sit in your bag until you hand one over from Chat.
          </p>
          {AllGifts.map((gift) => (
            <div key={gift.id} className="shopRow">
              <EntityImage
                src={gift.image}
                name={gift.name}
                icon={gift.icon}
                size={34}
              />
              <span className="rowText">
                <span className="rowTitle">{gift.name}</span>
                <span className="rowMeta">
                  ${gift.price}
                  {owned(gift.id) > 0 && ` · ${owned(gift.id)} in bag`}
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={money < gift.price}
                onClick={() =>
                  buy(gift.name, () => buyGift(dispatch, store.getState(), gift.id))
                }
              >
                Buy
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === Tab.Upgrades && (
        <div className="grid gap-1.5">
          <p className="phoneHint">
            Upgrades apply from the start of the next week.
          </p>
          {AllUpgrades.map((upgrade) => {
            const bought = upgrades.includes(upgrade.id);
            const blocked =
              upgrade.requires !== undefined && !upgrades.includes(upgrade.requires);
            return (
              <div key={upgrade.id} className="shopRow">
                <span className="rowText">
                  <span className="rowTitle">{upgrade.name}</span>
                  <span className="rowMeta">
                    ${upgrade.price}
                    {blocked &&
                      ` · needs ${getUpgrade(upgrade.requires!)?.name ?? upgrade.requires}`}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={bought || blocked || money < upgrade.price}
                  onClick={() =>
                    buy(upgrade.name, () =>
                      purchaseUpgrade(dispatch, store.getState(), upgrade.id),
                    )
                  }
                >
                  {bought ? "Owned" : "Buy"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === Tab.Housing && (
        <div className="grid gap-1.5">
          <p className="phoneHint">
            A bigger place means more roommates, and roommates never drift away.
          </p>
          {AllHouses.map((house) => {
            const current = house.id === houseState.id;
            const downsize = house.price < getHouse(houseState.id).price;
            return (
              <div key={house.id} className="shopRow">
                <EntityImage src={house.image} name={house.name} size={34} />
                <span className="rowText">
                  <span className="rowTitle">{house.name}</span>
                  <span className="rowMeta">
                    ${house.price} · {house.maxRoomates} roommate(s)
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={current || downsize || money < house.price}
                  onClick={() =>
                    buy(house.name, () =>
                      moveHouse(dispatch, store.getState(), house.id),
                    )
                  }
                >
                  {current ? "Current" : downsize ? "—" : "Move in"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Shop;

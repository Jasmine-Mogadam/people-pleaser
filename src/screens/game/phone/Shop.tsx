import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import BackButton from "./BackButton";
import { AllGifts } from "@/objects/catalog";
import { AllHouses, getHouse } from "@/objects/house";
import { AllUpgrades, getUpgrade } from "@/objects/upgrade";
import { buyGift, moveHouse, purchaseUpgrade } from "@/game/interactions";
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
  const money = useAppSelector((state) => state.money);
  const inventory = useAppSelector((state) => state.inventory);
  const upgrades = useAppSelector((state) => state.upgrades);
  const houseState = useAppSelector((state) => state.house);
  const [tab, setTab] = useState(Tab.Gifts);
  const [notice, setNotice] = useState<string | null>(null);

  const owned = (giftId: string) =>
    inventory.filter((id) => id === giftId).length;

  return (
    <div className="screen">
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> Shop · $
        {Math.round(money)}
      </div>

      <div className="flex gap-1">
        {Object.values(Tab).map((name) => (
          <Button
            key={name}
            variant={tab === name ? "default" : "outline"}
            onClick={() => setTab(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      {tab === Tab.Gifts && (
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Gifts are kept in your bag until you hand them over from Contacts.
          </p>
          {AllGifts.map((gift) => (
            <div key={gift.id} className="flex items-center gap-2">
              <EntityImage src={gift.image} name={gift.name} size={40} />
              <div className="grow">
                <div>{gift.name}</div>
                <div className="text-xs text-muted-foreground">
                  ${gift.price}
                  {owned(gift.id) > 0 && ` · ${owned(gift.id)} in bag`}
                </div>
              </div>
              <Button
                variant="outline"
                disabled={money < gift.price}
                onClick={() =>
                  setNotice(buyGift(dispatch, store.getState(), gift.id))
                }
              >
                Buy
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === Tab.Upgrades && (
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            Upgrades apply from the start of the next week.
          </p>
          {AllUpgrades.map((upgrade) => {
            const bought = upgrades.includes(upgrade.id);
            const blocked =
              upgrade.requires !== undefined &&
              !upgrades.includes(upgrade.requires);
            return (
              <div key={upgrade.id} className="flex items-center gap-2">
                <div className="grow">
                  <div>{upgrade.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${upgrade.price}
                    {blocked &&
                      ` · needs ${getUpgrade(upgrade.requires!)?.name ?? upgrade.requires}`}
                  </div>
                </div>
                <Button
                  variant="outline"
                  disabled={bought || blocked || money < upgrade.price}
                  onClick={() =>
                    setNotice(
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
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">
            A bigger place means more roommates, and roommates do not drift away.
          </p>
          {AllHouses.map((house) => {
            const current = house.id === houseState.id;
            const downsize = house.price < getHouse(houseState.id).price;
            return (
              <div key={house.id} className="flex items-center gap-2">
                <EntityImage src={house.image} name={house.name} size={40} />
                <div className="grow">
                  <div>{house.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${house.price} · {house.maxRoomates} roommate(s)
                  </div>
                </div>
                <Button
                  variant="outline"
                  disabled={current || downsize || money < house.price}
                  onClick={() =>
                    setNotice(moveHouse(dispatch, store.getState(), house.id))
                  }
                >
                  {current ? "Current" : downsize ? "—" : "Move in"}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {notice && (
        <p className="text-sm" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}

export default Shop;

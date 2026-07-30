import FriendSearch from "@/components/ui/friend/friendSearch";
import BackButton from "./BackButton";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import { getFriend, getGift } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import { chatWithFriend, giveGift } from "@/game/interactions";
import { toastFromResult } from "@/game/resultToast";
import { useToast } from "@/components/ui/toastContext";
import { ActionPointCost } from "@/game/rules";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

function Chat({
  setActiveScreen,
}: {
  setActiveScreen: (screen: string) => void;
}) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const friendRecords = useAppSelector((state) => state.friends);
  const inventory = useAppSelector((state) => state.inventory);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const met = friendRecords
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));
  const selected = selectedId ? getFriend(selectedId) : null;

  // One row per distinct item with a count, so a bag of five candies is one button.
  const bag = [...new Set(inventory)].map((id) => ({
    id,
    count: inventory.filter((other) => other === id).length,
  }));

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>Chat</span>
      </div>

      {met.length === 0 ? (
        <p className="phoneHint">
          No contacts yet. WormGround and going out are how you meet people.
        </p>
      ) : (
        <>
          <FriendSearch
            friends={met}
            select={true}
            compact={true}
            selectedIds={selectedId ? [selectedId] : []}
            onToggle={(friend) =>
              setSelectedId((current) => (current === friend.id ? null : friend.id))
            }
          />

          {selected && (
            <div className="grid gap-2">
              <Button
                onClick={() =>
                  toast(
                    toastFromResult(
                      chatWithFriend(dispatch, store.getState(), selected.id),
                    ),
                  )
                }
                disabled={actionPoints < ActionPointCost.Chat}
              >
                Message {selected.name} ({ActionPointCost.Chat} AP)
              </Button>

              {bag.length > 0 && (
                <div className="grid gap-1.5">
                  <span className="phoneHint">
                    Give a gift ({ActionPointCost.Gift} AP)
                  </span>
                  <div className="giftRow">
                    {bag.map((entry) => {
                      const gift = getGift(entry.id);
                      if (!gift) return null;
                      return (
                        <Button
                          key={entry.id}
                          size="sm"
                          variant="outline"
                          disabled={actionPoints < ActionPointCost.Gift}
                          onClick={() =>
                            toast(
                              toastFromResult(
                                giveGift(
                                  dispatch,
                                  store.getState(),
                                  selected.id,
                                  gift.id,
                                ),
                              ),
                            )
                          }
                        >
                          <EntityImage
                            src={gift.image}
                            name={gift.name}
                            icon={gift.icon}
                            size={20}
                          />
                          {gift.name} ×{entry.count}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {actionPoints <= 0 && (
        <p className="phoneHint">
          No action points left. End the week to get more.
        </p>
      )}
    </div>
  );
}

export default Chat;

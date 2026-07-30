import FriendSearch from "@/components/ui/friend/friendSearch";
import BackButton from "./BackButton";
import { Button } from "@/components/ui/button";
import ResultDialog from "@/components/ui/resultDialog";
import EntityImage from "@/components/ui/entityImage";
import { getFriend, getGift } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import {
  chatWithFriend,
  giveGift,
  type InteractionResult,
} from "@/game/interactions";
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
  const friendRecords = useAppSelector((state) => state.friends);
  const inventory = useAppSelector((state) => state.inventory);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<InteractionResult | null>(null);

  const met = friendRecords
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));
  const selected = selectedId ? getFriend(selectedId) : null;

  // One row per distinct item, with a count, so a bag of five candies is one button.
  const bag = [...new Set(inventory)].map((id) => ({
    id,
    count: inventory.filter((other) => other === id).length,
  }));

  return (
    <div className="screen">
      <div className="header">
        <BackButton setActiveScreen={setActiveScreen} /> Chat
      </div>

      {met.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No contacts yet. WormGround and going out are how you meet people.
        </p>
      ) : (
        <>
          <FriendSearch
            friends={met}
            select={true}
            selectedIds={selectedId ? [selectedId] : []}
            onToggle={(friend) =>
              setSelectedId((current) =>
                current === friend.id ? null : friend.id,
              )
            }
          />

          {selected && (
            <div className="grid gap-2">
              <Button
                onClick={() =>
                  setResult(
                    chatWithFriend(dispatch, store.getState(), selected.id),
                  )
                }
                disabled={actionPoints < ActionPointCost.Chat}
              >
                Send Message to {selected.name}{" "}
                <i>Cost: {ActionPointCost.Chat} AP</i>
              </Button>

              {bag.length > 0 && (
                <div className="grid gap-1">
                  <span className="text-sm">
                    Give a gift ({ActionPointCost.Gift} AP)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {bag.map((entry) => {
                      const gift = getGift(entry.id);
                      if (!gift) return null;
                      return (
                        <Button
                          key={entry.id}
                          variant="outline"
                          disabled={actionPoints < ActionPointCost.Gift}
                          onClick={() =>
                            setResult(
                              giveGift(
                                dispatch,
                                store.getState(),
                                selected.id,
                                gift.id,
                              ),
                            )
                          }
                        >
                          <EntityImage
                            src={gift.image}
                            name={gift.name}
                            size={24}
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
        <p className="text-sm text-destructive">
          No action points left. End the week to get more.
        </p>
      )}

      <ResultDialog result={result} onClose={() => setResult(null)} />
    </div>
  );
}

export default Chat;

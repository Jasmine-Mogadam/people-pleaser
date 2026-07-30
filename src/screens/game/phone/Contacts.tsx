import { useState } from "react";
import { MessageCircle, MapPin } from "lucide-react";
import FriendSearch from "@/components/ui/friend/friendSearch";
import FriendDetail from "@/components/ui/friend/friendDetail";
import EntityImage from "@/components/ui/entityImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BackButton from "./BackButton";
import { getFriend, getGift } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import { chatWithFriend, giveGift } from "@/game/interactions";
import { toastFromResult } from "@/game/resultToast";
import { useAnnounce } from "@/game/useAnnounce";
import { ActionPointCost } from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/**
 * The one place for people. Opening somebody shows what you know about them and
 * everything you can do with them, instead of splitting messaging into its own
 * app you had to remember to visit.
 */
function Contacts({
  setActiveScreen,
  onPlanHangout,
}: {
  setActiveScreen: (screen: string) => void;
  onPlanHangout: (friend: Friend) => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const records = useAppSelector((state) => state.friends);
  const inventory = useAppSelector((state) => state.inventory);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [openId, setOpenId] = useState<string | null>(null);

  // Records hold progress; the catalog holds the character. Join them after the
  // selector, so the selector keeps returning the same array reference.
  const met = records
    .map((record) => getFriend(record.id))
    .filter((f): f is Friend => Boolean(f));

  const open = openId ? getFriend(openId) : null;
  const openRecord = records.find((r) => r.id === openId);

  // One row per distinct item with a count, so a bag of five candies is one button.
  const bag = [...new Set(inventory)].map((id) => ({
    id,
    count: inventory.filter((other) => other === id).length,
  }));

  return (
    <div className="screen">
      <div className="screenHeader">
        <BackButton setActiveScreen={setActiveScreen} />
        <span>Contacts</span>
      </div>

      {met.length === 0 ? (
        <p className="phoneHint">
          Nobody yet. Scroll WormGround, or pick a place on Maps and go alone.
        </p>
      ) : (
        <>
          <p className="phoneHint">
            Open somebody to message them, hand over a gift, or plan a trip out.
          </p>
          <FriendSearch
            friends={met}
            select={true}
            compact={true}
            selectedIds={[]}
            onToggle={(friend) => setOpenId(friend.id)}
          />
        </>
      )}

      <Dialog
        open={open !== null}
        onOpenChange={(isOpen) => !isOpen && setOpenId(null)}
      >
        <DialogContent className="sm:max-w-md">
          {open && (
            <div className="grid gap-4">
              <FriendDetail
                friend={open}
                friendshipLevel={openRecord?.friendshipLevel}
                discoveredKeys={openRecord?.discoveredPreferences}
              />

              <div className="grid gap-2">
                <Button
                  onClick={() =>
                    announce(
                      toastFromResult(
                        chatWithFriend(dispatch, store.getState(), open.id),
                      ),
                    )
                  }
                  disabled={actionPoints < ActionPointCost.Chat}
                >
                  <MessageCircle />
                  Message ({ActionPointCost.Chat} AP)
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenId(null);
                    onPlanHangout(open);
                  }}
                >
                  <MapPin />
                  Hang out ({ActionPointCost.Hangout} AP)
                </Button>

                {bag.length > 0 ? (
                  <div className="grid gap-1.5">
                    <span className="text-xs text-muted-foreground">
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
                              announce(
                                toastFromResult(
                                  giveGift(
                                    dispatch,
                                    store.getState(),
                                    open.id,
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
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Your bag is empty. The shop sells gifts.
                  </p>
                )}

                {actionPoints <= 0 && (
                  <p className="text-xs text-destructive">
                    No action points left. End the week to get more.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Contacts;

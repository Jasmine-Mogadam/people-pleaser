import { useEffect, useState } from "react";
import { ArrowUpRightIcon, Gift, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EntityImage from "@/components/ui/entityImage";
import PreferenceTag from "@/components/ui/preferenceTag";
import { getGift } from "@/objects/catalog";
import type { Friend } from "@/objects/friend";
import type { Preference } from "@/objects/preference";
import { chatWithFriend, giveGift } from "@/game/interactions";
import { knownPreference } from "@/game/preferences";
import { toastFromResult } from "@/game/resultToast";
import { useAnnounce } from "@/game/useAnnounce";
import { ActionPointCost, friendshipTier } from "@/game/rules";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import store from "@/state/store";

/** Long enough for the browser to paint the empty bar before it starts filling. */
const BAR_DELAY_MS = 60;

function TasteList({
  heading,
  preferences,
}: {
  heading: string;
  preferences: Preference[];
}) {
  return (
    <div>
      <span className="profileTasteHead">{heading}</span>
      <ul className="profileTasteList">
        {preferences.length === 0 ? (
          <li className="phoneHint">Nothing uncovered yet.</li>
        ) : (
          preferences.map((p) => (
            <li key={p.target.key}>
              <EntityImage
                src={p.target.image}
                name={p.target.name}
                icon={p.target.icon}
                size={20}
              />
              <span>{p.target.name}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/**
 * One person, and everything you can do with them. This used to be a dialog over
 * the phone; as a screen it keeps the whole interaction inside the handset.
 */
function FriendProfile({
  friend,
  onPlanHangout,
}: {
  friend: Friend;
  onPlanHangout: () => void;
}) {
  const dispatch = useAppDispatch();
  const announce = useAnnounce();
  const record = useAppSelector((state) =>
    state.friends.find((f) => f.id === friend.id),
  );
  const inventory = useAppSelector((state) => state.inventory);
  const actionPoints = useAppSelector((state) => state.actionPoints);
  const [showGifts, setShowGifts] = useState(false);
  const [barReady, setBarReady] = useState(false);

  // Grown from zero on arrival, so how far along you are registers as progress
  // rather than as a bar that was always that long.
  useEffect(() => {
    const timer = setTimeout(() => setBarReady(true), BAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const level = record?.friendshipLevel ?? 0;
  const discovered = record?.discoveredPreferences ?? [];
  const known = (list: Preference[]) =>
    list.filter((p) => discovered.includes(p.target.key));

  // One row per distinct item with a count, so a bag of five candies is one button.
  const bag = [...new Set(inventory)].map((id) => ({
    id,
    count: inventory.filter((other) => other === id).length,
  }));

  return (
    <div className="profileScreen">
      <div className="profileArt">
        <EntityImage src={friend.image} name={friend.name} />
      </div>

      <div>
        <div className="profileName">{friend.name}</div>
        <div className="profileMeta">{friend.personality}</div>
        <div className="profileOwner">
          <a href={friend.ownerUrl} target="_blank" rel="noreferrer">
            owned by&nbsp;
            <u className="inline-flex items-center">
              {friend.owner}
              <ArrowUpRightIcon className="h-3 w-3" />
            </u>
          </a>
        </div>
      </div>

      <div className="profileBar">
        <div className="profileBarHead">
          <span className="profileTier">{friendshipTier(level)}</span>
          <span>{Math.round(level)}/100</span>
        </div>
        <div
          className="profileTrack"
          role="meter"
          aria-valuenow={Math.round(level)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Friendship with ${friend.name}`}
        >
          <div
            className="profileFill"
            style={{ width: barReady ? `${level}%` : "0%" }}
          />
        </div>
      </div>

      <div className="profileActions">
        <Button
          disabled={actionPoints < ActionPointCost.Chat}
          onClick={() =>
            announce(
              toastFromResult(
                chatWithFriend(dispatch, store.getState(), friend.id),
              ),
            )
          }
        >
          <MessageCircle />
          Message · {ActionPointCost.Chat} AP
        </Button>

        <Button
          variant="outline"
          disabled={actionPoints < ActionPointCost.Hangout}
          onClick={onPlanHangout}
        >
          <MapPin />
          Hang out · {ActionPointCost.Hangout} AP
        </Button>

        <Button
          variant="outline"
          aria-expanded={showGifts}
          disabled={bag.length === 0 || actionPoints < ActionPointCost.Gift}
          onClick={() => setShowGifts((shown) => !shown)}
        >
          <Gift />
          Give a gift · {ActionPointCost.Gift} AP
        </Button>

        {showGifts && (
          <div className="profileGifts">
            {bag.map((entry) => {
              const gift = getGift(entry.id);
              if (!gift) return null;
              // Whether this is a thoughtful present or an insult, once you have
              // found out which.
              const opinion = knownPreference(friend, gift, discovered);
              return (
                <Button
                  key={entry.id}
                  size="sm"
                  variant="outline"
                  className="listRow"
                  data-preference={opinion ?? undefined}
                  disabled={actionPoints < ActionPointCost.Gift}
                  onClick={() => {
                    setShowGifts(false);
                    announce(
                      toastFromResult(
                        giveGift(
                          dispatch,
                          store.getState(),
                          friend.id,
                          gift.id,
                        ),
                      ),
                    );
                  }}
                >
                  <EntityImage
                    src={gift.image}
                    name={gift.name}
                    icon={gift.icon}
                    size={20}
                  />
                  <span className="rowText">
                    <span className="rowTitle">{gift.name}</span>
                  </span>
                  {opinion && <PreferenceTag preference={opinion} />}
                  <span className="rowMeta">×{entry.count}</span>
                </Button>
              );
            })}
          </div>
        )}

        {bag.length === 0 && (
          <p className="phoneHint">Your bag is empty. The shop sells gifts.</p>
        )}

        {actionPoints <= 0 && (
          <p className="text-xs text-destructive">
            No action points left. End the week to get more.
          </p>
        )}
      </div>

      {/* Only the opinions you have actually uncovered by chatting, gifting, or
          going somewhere together. */}
      <div className="profileTaste">
        <TasteList heading="Likes" preferences={known(friend.getLikes())} />
        <TasteList heading="Dislikes" preferences={known(friend.getDislikes())} />
      </div>
    </div>
  );
}

export default FriendProfile;

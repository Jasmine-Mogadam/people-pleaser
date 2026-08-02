import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import EntityImage from "@/components/ui/entityImage";
import PreferenceTag from "@/components/ui/preferenceTag";
import { getFriend, getHangout } from "@/objects/catalog";
import type { Hangout } from "@/objects/hangout";
import type { PreferenceType } from "@/objects/preference";
import { knownPreference } from "@/game/preferences";
import { useAppSelector } from "@/state/hooks";

/**
 * Places you have actually heard about. Friends mention their favourites when
 * you chat, and WormGround turns up the rest.
 *
 * If anybody is already coming along, each place says what they make of it --
 * but only the opinions you have uncovered, so the list rewards paying
 * attention rather than doing the homework for you.
 */
function Maps({
  guestIds,
  onChoose,
}: {
  guestIds: string[];
  onChoose: (hangout: Hangout) => void;
}) {
  const discoveredHangouts = useAppSelector((state) => state.discoveredHangouts);
  const records = useAppSelector((state) => state.friends);
  const [filter, setFilter] = useState("");

  const places = discoveredHangouts
    .map((id) => getHangout(id))
    .filter((h): h is Hangout => Boolean(h));

  const shown = places.filter((place) =>
    place.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const guests = guestIds.flatMap((id) => {
    const friend = getFriend(id);
    const record = records.find((r) => r.id === id);
    return friend && record ? [{ friend, record }] : [];
  });

  const opinionsOn = (place: Hangout) =>
    guests
      .map((guest) => ({
        name: guest.friend.name,
        preference: knownPreference(
          guest.friend,
          place,
          guest.record.discoveredPreferences,
        ),
      }))
      .filter(
        (opinion): opinion is { name: string; preference: PreferenceType } =>
          opinion.preference !== null,
      );

  if (places.length === 0) {
    return (
      <div className="screen">
        <p className="phoneHint">
          No places saved yet. Chat with people or scroll WormGround to find
          some.
        </p>
      </div>
    );
  }

  return (
    <div className="listScreen">
      <div className="listTop">
        <span className="listCount">
          {places.length} {places.length === 1 ? "Place" : "Places"}
        </span>
        <div className="phoneSearch">
          <Search aria-hidden="true" />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Search places…"
            aria-label="Search places by name"
          />
        </div>
      </div>

      <div className="rowList">
        {shown.length === 0 ? (
          <p className="phoneHint">Nowhere by that name.</p>
        ) : (
          shown.map((place) => {
            const opinions = opinionsOn(place);
            // Tinting the whole row only makes sense when the group agrees; if
            // one of them loves it and another cannot stand it, the tags say so
            // and the row stays neutral.
            const agreed =
              opinions.length > 0 &&
              opinions.every((o) => o.preference === opinions[0].preference)
                ? opinions[0].preference
                : undefined;
            return (
              <button
                key={place.id}
                className="phoneRow"
                data-preference={agreed}
                onClick={() => onChoose(place)}
              >
                <span className="rowAvatar isPlace">
                  <EntityImage src={place.image} name={place.name} />
                </span>
                <span className="rowBody">
                  {/* The opinion rides alongside the name rather than under it:
                      a list of places is long, and this way each one is still
                      two lines whether anybody has an opinion or not. */}
                  <span className="rowHeading">
                    <span className="rowName">{place.name}</span>
                    {opinions.map((opinion) => (
                      <PreferenceTag
                        key={opinion.name}
                        preference={opinion.preference}
                        who={opinions.length > 1 ? opinion.name : undefined}
                      />
                    ))}
                  </span>
                  <span className="rowSub">
                    fits {place.capacity} · ${place.costPerPerson} each
                  </span>
                </span>
                <ChevronRight className="rowChevron" aria-hidden="true" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Maps;

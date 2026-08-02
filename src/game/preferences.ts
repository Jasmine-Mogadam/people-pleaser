import type { GameEntity } from "@/objects/entity";
import type { Friend } from "@/objects/friend";
import { PreferenceEnum, type PreferenceType } from "@/objects/preference";

/**
 * How an opinion reads once the player has uncovered it. Lowercase verbs, so a
 * tag can sit on the same line as the thing it is about without shouting over
 * it, and so it still reads as a sentence with a name in front: "Reina loves".
 */
export const PreferenceLabel: Record<PreferenceType, string> = {
    [PreferenceEnum.Favorite]: "loves",
    [PreferenceEnum.Like]: "likes",
    [PreferenceEnum.Dislike]: "dislikes",
    [PreferenceEnum.Hate]: "hates",
};

/**
 * How somebody feels about something -- but only once the player has actually
 * found out. Everything the interface shows about an opinion goes through here,
 * so nothing can leak a preference the player has not earned by chatting,
 * gifting, or going somewhere together.
 */
export function knownPreference(
    friend: Friend,
    target: GameEntity,
    discoveredKeys: string[],
): PreferenceType | null {
    if (!discoveredKeys.includes(target.key)) return null;
    return friend.preferenceFor(target);
}

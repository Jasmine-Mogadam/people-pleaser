import { EntityKindEnum, getEntities, registerEntities } from "./entity";
import { Friend } from "./friend";
import { Gift } from "./gift";
import { Hangout } from "./hangout";
import { PersonalityEnum } from "./personality";
import { addFriendPreference, getPreferencesForPersonality } from "./preference";

/**
 * Every piece of catalog data, built and wired together in one place.
 *
 * Import game content from here rather than from friend.ts / gift.ts / hangout.ts
 * directly: preferences are cross-referenced at the bottom of this file, and a
 * module that skipped this one would see friends with empty preference tables.
 */

export const AllFriends: Friend[] = [
    new Friend("Benny", "royalc4tnip", PersonalityEnum.Relaxed),
    new Friend("Apple", "NatieN", PersonalityEnum.Silly),
    new Friend("Lucille", "NatieN", PersonalityEnum.Refined),
    new Friend("Cherie", "NatieN", PersonalityEnum.Relaxed),
    new Friend("Yvonne", "NatieN", PersonalityEnum.Intense),
    new Friend("Devin", "HybridStarscapes", PersonalityEnum.Shy),
    new Friend("Andrew", "HybridStarscapes", PersonalityEnum.Relaxed),
    new Friend("Reina", "HybridStarscapes", PersonalityEnum.Intense),
    new Friend("Zac", "HybridStarscapes", PersonalityEnum.Relaxed),
];

export const AllGifts: Gift[] = [
    new Gift("Candy", [PersonalityEnum.Relaxed, PersonalityEnum.Silly], 10, "wip."),
    new Gift("Caffeine", [PersonalityEnum.Intense, PersonalityEnum.Refined], 15, "wip."),
    new Gift("Plushie", [PersonalityEnum.Shy, PersonalityEnum.Relaxed], 10, "wip."),
    new Gift("Stickers", [PersonalityEnum.Silly, PersonalityEnum.Shy], 10, "wip."),
    new Gift("Clothes", [PersonalityEnum.Relaxed, PersonalityEnum.Refined], 10, "wip."),
    new Gift("Book", [PersonalityEnum.Shy, PersonalityEnum.Refined], 10, "wip."),
    new Gift("Novelty Figurine", [PersonalityEnum.Silly], 50, "wip."),
    new Gift("Jewelry", [PersonalityEnum.Refined], 50, "wip."),
    new Gift("Pocket Knife", [PersonalityEnum.Intense], 50, "wip."),
    new Gift("Headphones", [PersonalityEnum.Shy], 50, "wip."),
];

// capacity = how many people can come, cost = dollars charged per attendee.
export const AllHangouts: Hangout[] = [
    new Hangout("Art Museum", [PersonalityEnum.Refined, PersonalityEnum.Shy], 3, 15, "The curators here love finding local artists to display, with exhibits changing frequently."),
    new Hangout("Fancy Restaurant", [PersonalityEnum.Refined, PersonalityEnum.Relaxed], 2, 45, "wip."),
    new Hangout("Trampoline Park", [PersonalityEnum.Intense, PersonalityEnum.Silly], 4, 25, "wip."),
    new Hangout("Fast Food Joint", [PersonalityEnum.Silly, PersonalityEnum.Relaxed], 4, 10, "wip."),
    new Hangout("Abandoned Building", [PersonalityEnum.Intense, PersonalityEnum.Shy], 2, 0, "wip."),
    new Hangout("Movie Theater", [PersonalityEnum.Shy, PersonalityEnum.Relaxed], 3, 20, "wip."),
    new Hangout("Retro Arcade", [PersonalityEnum.Silly, PersonalityEnum.Shy], 4, 15, "wip."),
    new Hangout("Masquerade Ball", [PersonalityEnum.Refined, PersonalityEnum.Silly], 5, 60, "wip."),
];

// Order matters: everything has to be registered before preferences can be built,
// since a preference table is just cross-references into the registry.
registerEntities([...AllFriends, ...AllGifts, ...AllHangouts]);
AllFriends.forEach((f) => (f.preferences = getPreferencesForPersonality(f)));

// HybridStarscapes relationships
addFriendPreference("Devin", "Andrew");
addFriendPreference("Reina", "Andrew");

export function getFriend(id: string): Friend | undefined {
    return AllFriends.find((f) => f.id === id);
}

export function getGift(id: string): Gift | undefined {
    return AllGifts.find((g) => g.id === id);
}

export function getHangout(id: string): Hangout | undefined {
    return AllHangouts.find((h) => h.id === id);
}

/** Sanity check that the registry lined up with the exported arrays. */
export function catalogSize(): number {
    return (
        getEntities(EntityKindEnum.Friend).length +
        getEntities(EntityKindEnum.Gift).length +
        getEntities(EntityKindEnum.Hangout).length
    );
}

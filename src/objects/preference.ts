import { EntityKindEnum, getEntities, type GameEntity } from "./entity";
import { type Personality, PersonalityEnum } from "./personality";
import type { Friend } from "./friend";

export const PreferenceEnum = {
    Favorite: "Favorite",
    Like: "Like",
    Dislike: "Dislike",
    Hate: "Hate",
}
export type PreferenceType = typeof PreferenceEnum[keyof typeof PreferenceEnum];

/** How strongly a preference pushes an interaction's payout around. */
export const PreferenceMultiplier: Record<PreferenceType, number> = {
    [PreferenceEnum.Favorite]: 2,
    [PreferenceEnum.Like]: 1.5,
    [PreferenceEnum.Dislike]: 0.4,
    [PreferenceEnum.Hate]: -0.5,
};

class Preference {
    target: GameEntity;
    preference: PreferenceType;
    constructor(target: GameEntity, preference: PreferenceType) {
        this.target = target;
        this.preference = preference;
    }
}
export { Preference };

function hasPersonality(entity: GameEntity, personality: Personality): boolean {
    const preferences = (entity as { personalityPreferences?: Personality[] }).personalityPreferences;
    return preferences ? preferences.includes(personality) : false;
}

/**
 * Builds the default preference table for a friend from their personality.
 * Takes the friend rather than a bare personality so they are always filtered out
 * of their own list -- nobody gets to be their own friend.
 */
export function getPreferencesForPersonality(friend: Friend): Preference[] {
    const personality = friend.personality;

    function getFriendPersonaPref(target: Personality, preference: PreferenceType): Preference[] {
        return (getEntities(EntityKindEnum.Friend) as Friend[])
            .filter(other => other.id !== friend.id && other.personality === target)
            .map(other => new Preference(other, preference));
    }
    function getThingPref(kind: string): Preference[] {
        return getEntities(kind)
            .filter(entity => hasPersonality(entity, personality))
            .map(entity => new Preference(entity, PreferenceEnum.Like));
    }

    // this is very readable :)
    const samePersonalityFriends = getFriendPersonaPref(personality, PreferenceEnum.Like);
    const defaultHangoutPreferences = getThingPref(EntityKindEnum.Hangout);
    const defaultGiftPreferences = getThingPref(EntityKindEnum.Gift);
    const defaultPreferences = [...defaultHangoutPreferences, ...defaultGiftPreferences, ...samePersonalityFriends];

    switch (personality) {
        case PersonalityEnum.Relaxed:
            return [
                ...defaultPreferences,
            ];
        case PersonalityEnum.Refined:
            return [
                ...defaultPreferences,
                ...getFriendPersonaPref(PersonalityEnum.Shy, PreferenceEnum.Like),
                ...getFriendPersonaPref(PersonalityEnum.Silly, PreferenceEnum.Dislike)
            ];
        case PersonalityEnum.Shy:
            return [
                ...defaultPreferences,
                ...getFriendPersonaPref(PersonalityEnum.Refined, PreferenceEnum.Like),
                ...getFriendPersonaPref(PersonalityEnum.Intense, PreferenceEnum.Dislike)
            ];
        case PersonalityEnum.Intense:
            return [
                ...defaultPreferences,
                ...getFriendPersonaPref(PersonalityEnum.Silly, PreferenceEnum.Like),
                ...getFriendPersonaPref(PersonalityEnum.Shy, PreferenceEnum.Dislike)
            ];
        case PersonalityEnum.Silly:
            return [
                ...defaultPreferences,
                ...getFriendPersonaPref(PersonalityEnum.Intense, PreferenceEnum.Like),
                ...getFriendPersonaPref(PersonalityEnum.Refined, PreferenceEnum.Dislike)
            ];
    }
    console.warn(`No preferences defined for personality: ${personality}`);
    return [];
}

// Adds things like mutual enemies and mutual friends.
export function addFriendPreference(name1: string, name2: string, preferenceType: PreferenceType = PreferenceEnum.Favorite): void {
    const friends = getEntities(EntityKindEnum.Friend) as Friend[];
    const f1 = friends.find(f => f.name === name1);
    const f2 = friends.find(f => f.name === name2);
    if (!f1 || !f2)
        return console.error(`Could not find one or both friends: ${name1}, ${name2}`);
    if (f1.id === f2.id)
        return console.error(`${name1} cannot have a preference about themselves.`);
    setPreference(f1, f2, preferenceType);
    setPreference(f2, f1, preferenceType);
}

/** Replaces any existing entry, so upgrading a Like to a Favorite leaves no stale row. */
function setPreference(friend: Friend, target: GameEntity, preferenceType: PreferenceType): void {
    const existing = friend.preferences.findIndex(p => p.target.key === target.key);
    if (existing !== -1) friend.preferences.splice(existing, 1);
    friend.preferences.push(new Preference(target, preferenceType));
}

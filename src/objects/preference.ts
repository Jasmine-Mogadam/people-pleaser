import { AllHangouts, type Hangout } from "./hangout";
import { type Personality, PersonalityEnum } from "./personality";
import { AllGifts, type Gift } from "./gift";
import { AllFriends, type Friend } from "./friend";

export const PreferenceEnum = {
    Like: "Like",
    Dislike: "Dislike",
}
export type PreferenceType = typeof PreferenceEnum[keyof typeof PreferenceEnum];

class Preference {
    value: Hangout | Gift | Friend;
    preference: PreferenceType;
    constructor(value: Hangout | Gift | Friend, preference: PreferenceType) {
        this.value = value;
        this.preference = preference;
    }
}
export { type Preference };

export function getPreferencesForPersonality(personality: Personality): Preference[] {
    function getFriendPersonaPref(personality: Personality, preference: PreferenceType): Preference[] {
        return AllFriends.filter(friend => friend.personality === personality)
            .map(friend => new Preference(friend, preference));
    }
    // this is very readable :)
    const samePersonalityFriends = getFriendPersonaPref(personality, PreferenceEnum.Like);
    const defaultHangoutPreferences = AllHangouts.filter(hangout => hangout.personalityPreferences.includes(personality))
        .map(hangout => new Preference(hangout, PreferenceEnum.Like));
    const defaultGiftPreferences = AllGifts.filter(gift => gift.personalityPreferences.includes(personality))
        .map(gift => new Preference(gift, PreferenceEnum.Like));
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
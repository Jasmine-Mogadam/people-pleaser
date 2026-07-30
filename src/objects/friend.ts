import { type Personality, PersonalityEnum } from "./personality";
import { addFriendPreference, getPreferencesForPersonality, PreferenceEnum, type Preference } from "./preference";
import store from "../state/store";
import { discoverFriend, updateFriend } from "../state/gameStateSlice";

const { friends } = store.getState();

let id = -1;
class Friend {
    id: number;
    name: string;
    owner: string;
    ownerUrl: string;
    image: string;
    personality: Personality;
    preferences: Preference[] = [];
    discoveredPreferences: Preference[] = [];
    friendshipLevel: number;
    constructor(
        name: string,
        owner: string,
        personality: Personality,
    ) {
        this.id = id++; // my favorite silly trick
        this.name = name;
        this.owner = owner;
        this.ownerUrl = `https://artfight.net/~${owner}`;
        this.image = new URL(`../assets/friend/${name.toLowerCase()}.png`, import.meta.url).href;
        this.personality = personality;
        this.friendshipLevel = 0;
    }

    /**
     *  Prevents friendship from going over 100 and under 0
     * @param levelsToAdd levels to add to the current friendship level (negative numbers subtract)
     */
    updateFriendshipLevel(levelsToAdd: number) {
        this.friendshipLevel = Math.max(0, Math.min(this.friendshipLevel + levelsToAdd, 100));
        this.updateState();
    }

    updateState() {
        const friendIndex = friends.findIndex(friend => friend.id === this.id);
        if (friendIndex === -1) {
            // Friend not found, add to the list
            discoverFriend(this);
        } else {
            // Friend found, update the existing entry
            updateFriend(this);
        }
    }

    getLikes(): Preference[] {
        return this.preferences.filter(
            (p) => p.preference === PreferenceEnum.Like || p.preference === PreferenceEnum.Favorite,
        );
    }

    // TODO: fix this so a hangout/gift with the same name as a friend does not get selected here D:
    getFriends(): Friend[] {
        return this.getLikes().filter(
            p => AllFriends.includes(p.value as Friend)
        ).map(p => p.value) as Friend[]
    }

    // TODO: make it based off favorites
    getBestFriends(): Friend[] {
        return this.getFriends().filter(f => f.owner === this.owner) // same owner
    }

    getDislikes(): Preference[] {
        return this.preferences.filter(
            (p) => p.preference === PreferenceEnum.Dislike || p.preference === PreferenceEnum.Hate,
        );
    }

    // random chance to be introduced to new friend
    introduceFriend(): Friend | null {
        // characters in allfriends but not in friends (people you have not met yet)
        const strangers = AllFriends.filter(f => !friends.includes(f));
        if (strangers.length === 0) return null // no more people to discover.

        const luck = Math.random() * 100
        let possibleFriends = null

        // rarest chance goes into effect
        // 25% introduce to best friend
        if (luck > 75) {
            possibleFriends = this.getBestFriends().filter(
                f => strangers.includes(f)
            )
        }
        // 10% introduce to liked friend
        if (luck > 90) {
            possibleFriends = this.getFriends().filter(
                f => strangers.includes(f)
            )
        }
        // 5% introduce to random
        if (luck > 95) {
            possibleFriends = strangers
        }

        if (possibleFriends && possibleFriends.length > 0) {
            const newFriend = possibleFriends[Math.random() * possibleFriends.length];
            discoverFriend(newFriend);
            return newFriend // friend rolled!!
        }

        return null; // no friend rolled
    }
}
export { type Friend };

// TODO: make it impossible to be your own friend
export const AllFriends = [new Friend(
    "Benny",
    "judylll",
    PersonalityEnum.Relaxed,
), new Friend(
    "Apple",
    "NatieN",
    PersonalityEnum.Intense,
), new Friend(
    "Lucille",
    "NatieN",
    PersonalityEnum.Refined,
), new Friend(
    "Cherie",
    "NatieN",
    PersonalityEnum.Relaxed,
), new Friend(
    "Yvonne",
    "NatieN",
    PersonalityEnum.Intense,
), new Friend(
    "Devin",
    "HybridStarscapes",
    PersonalityEnum.Shy,
), new Friend(
    "Andrew",
    "HybridStarscapes",
    PersonalityEnum.Relaxed,
), new Friend(
    "Reina",
    "HybridStarscapes",
    PersonalityEnum.Intense,
)]

AllFriends.forEach(f => f.preferences = getPreferencesForPersonality(f.personality))

// HybridStarscapes relationships
addFriendPreference("Devin", "Andrew")
addFriendPreference("Reina", "Andrew")
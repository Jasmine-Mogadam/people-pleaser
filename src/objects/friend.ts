import { type Personality, PersonalityEnum } from "./personality";
import { PreferenceEnum, type Preference } from "./preference";
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
        image: string,
        personality: Personality,
    ) {
        this.id = id++; // my favorite silly trick
        this.name = name;
        this.owner = owner;
        this.ownerUrl = `https://artfight.net/~${owner}`;
        this.image = image;
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
            (p) => p.preference === PreferenceEnum.Like,
        );
    }

    getDislikes(): Preference[] {
        return this.preferences.filter(
            (p) => p.preference === PreferenceEnum.Dislike,
        );
    }
}
export { type Friend };

export const AllFriends = [new Friend(
    "Test Man",
    "PinkFlamess",
    "test.png",
    PersonalityEnum.Relaxed,
)]

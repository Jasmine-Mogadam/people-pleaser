import { type Personality, PersonalityType } from "./personality";

let id = -1;
// I /could/ make a ridiculous interface and so the class isn't directly 
// exported so other classes don't have access to the constructor, but I'm eepy
export class Friend {
    id: number;
    name: string;
    owner: string;
    ownerUrl: string;
    image: string;
    personality: Personality;
    friendOverrides: number[];
    giftOverrides: string[];
    hangoutOverrides: string[];
    friendshipLevel: number;
    constructor(
        name: string,
        owner: string,
        image: string,
        personality: Personality,
        // I cannot be bothered to figure out a way to chain this in 
        // the big list so this is gonna be awful to update :(
        friendOverrides: number[],
        giftOverrides: string[],
        hangoutOverrides: string[],
    ) {
        this.id = id++; // my favorite silly trick
        this.name = name;
        this.owner = owner;
        this.ownerUrl = `https://artfight.net/~${owner}`;
        this.image = image;
        this.personality = personality;
        this.friendOverrides = friendOverrides;
        this.giftOverrides = giftOverrides;
        this.hangoutOverrides = hangoutOverrides;
        this.friendshipLevel = 0;
    }

    /**
     *  Prevents friendship from going over 100 and under 0
     * @param levelsToAdd levels to add to the current friendship level (negative numbers subtract)
     */
    updateFriendshipLevel(levelsToAdd: number) {
        this.friendshipLevel = Math.max(0, Math.min(this.friendshipLevel + levelsToAdd, 100));
    }
}
export const AllFriends = [new Friend(
    "Avery",
    "Avery",
    "avery.png",
    PersonalityType.Normal,
    [],
    [],
    [],
), new Friend(
    "Bree",
    "Bree",
    "bree.png",
    PersonalityType.Shy,
    [],
    [],
    [],
), new Friend(
    "Cameron",
    "Cameron",
    "cameron.png",
    PersonalityType.Intense,
    [],
    [],
    [],
)]
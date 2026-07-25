import store from "@/state/store";
import { type Personality, PersonalityEnum } from "./personality";
import { AllFriends, type Friend } from "./friend";
import { discoverFriend } from "@/state/gameStateSlice";

const { friends } = store.getState();

class Hangout {
    name: string;
    image: string;
    personalityPreferences: Personality[];
    description: string;
    constructor(name: string, image: string, personalityPreferences: Personality[], description: string) {
        this.name = name;
        this.image = image;
        this.personalityPreferences = personalityPreferences;
        this.description = description;
    }

    // TODO: make gifts, friends, and gifts have a shared abstract class that share this function
    getPeopleWhoLikeThis(): Friend[] {
        return AllFriends.filter(f => this.personalityPreferences.includes(f.personality));
    }

    // random chance to find a new friend
    // TODO: make gifts, friends, and gifts have a shared abstract class that share this function
    findFriend(): Friend | null {
        // characters in allfriends but not in friends (people you have not met yet)
        const strangers = AllFriends.filter(f => !friends.includes(f));
        if (strangers.length === 0) return null // no more people to discover.

        const luck = Math.random() * 100
        let possibleFriends = null

        // rarest chance goes into effect
        // 25% introduce to liked friend
        if (luck > 75) {
            possibleFriends = this.getPeopleWhoLikeThis().filter(
                f => strangers.includes(f)
            )
        }
        // 10% introduce to random friend
        if (luck > 90) {
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
export { type Hangout };

export const AllHangouts: Hangout[] = [
    new Hangout("Art Museum", "art_museum.png", [PersonalityEnum.Refined, PersonalityEnum.Shy], "The curators here love finding local artists to display, with exhibits changing frequently."),
    new Hangout("Fancy Restaurant", "fancy_restaurant.png", [PersonalityEnum.Refined, PersonalityEnum.Relaxed], "wip."),
    new Hangout("Trampoline Park", "trampoline_park.png", [PersonalityEnum.Intense, PersonalityEnum.Silly], "wip."),
    new Hangout("Fast Food Joint", "fast_food_joint.png", [PersonalityEnum.Silly, PersonalityEnum.Relaxed], "wip."),
    new Hangout("Abandoned Building", "abandoned_building.png", [PersonalityEnum.Intense, PersonalityEnum.Shy], "wip."),
    new Hangout("Movie Theater", "movie_theater.png", [PersonalityEnum.Shy, PersonalityEnum.Relaxed], "wip."),
    new Hangout("Retro Arcade", "retro_arcade.png", [PersonalityEnum.Silly, PersonalityEnum.Shy], "wip."),
    new Hangout("Masquerade Ball", "masquerade_ball.png", [PersonalityEnum.Refined, PersonalityEnum.Silly], "wip."),
]
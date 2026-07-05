import { type Personality, PersonalityEnum } from "./personality";

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
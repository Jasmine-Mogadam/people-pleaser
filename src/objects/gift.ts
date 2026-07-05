import { PersonalityEnum, type Personality } from "./personality";

class Gift {
    name: string;
    image: string;
    personalityPreferences: Personality[];
    price: number;
    description: string;
    constructor(name: string, image: string, personalityPreferences: Personality[], price: number, description: string) {
        this.name = name;
        this.image = image;
        this.personalityPreferences = personalityPreferences;
        this.price = price;
        this.description = description;
    }
}
export { type Gift };

export const AllGifts: Gift[] = [
    new Gift("Candy", "candy.png", [PersonalityEnum.Relaxed, PersonalityEnum.Silly], 10, "wip."),
    new Gift("Caffeine", "caffeine.png", [PersonalityEnum.Intense, PersonalityEnum.Refined], 15, "wip."),
    new Gift("Plushie", "plushie.png", [PersonalityEnum.Shy, PersonalityEnum.Relaxed], 10, "wip."),
    new Gift("Stickers", "stickers.png", [PersonalityEnum.Silly, PersonalityEnum.Shy], 10, "wip."),
    new Gift("Clothes", "clothes.png", [PersonalityEnum.Relaxed, PersonalityEnum.Refined], 10, "wip."),
    new Gift("Book", "book.png", [PersonalityEnum.Shy, PersonalityEnum.Refined], 10, "wip."),
    new Gift("Novelty Figurine", "keychain.png", [PersonalityEnum.Silly], 50, "wip."),
    new Gift("Jewelry", "jewelry.png", [PersonalityEnum.Refined], 50, "wip."),
    new Gift("Pocket Knife", "pocket_knife.png", [PersonalityEnum.Intense], 50, "wip."),
    new Gift("Headphones", "headphones.png", [PersonalityEnum.Shy], 50, "wip."),
]
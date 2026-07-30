import type { LucideIcon } from "lucide-react";
import { EntityKindEnum, GameEntity, type EntityKind } from "./entity";
import type { Personality } from "./personality";

class Gift extends GameEntity {
    readonly kind: EntityKind = EntityKindEnum.Gift;
    personalityPreferences: Personality[];
    price: number;

    // Gifts have no art, so each one carries an icon instead. The image is
    // looked up from the name, so it is not a constructor argument either.
    constructor(
        name: string,
        icon: LucideIcon,
        personalityPreferences: Personality[],
        price: number,
        description: string,
    ) {
        super(name, description);
        this.icon = icon;
        this.personalityPreferences = personalityPreferences;
        this.price = price;
    }
}

export { Gift };

import { EntityKindEnum, GameEntity, type EntityKind } from "./entity";
import type { Personality } from "./personality";

class Gift extends GameEntity {
    readonly kind: EntityKind = EntityKindEnum.Gift;
    personalityPreferences: Personality[];
    price: number;

    // Image is looked up from the name now, so it is not a constructor argument.
    constructor(name: string, personalityPreferences: Personality[], price: number, description: string) {
        super(name, description);
        this.personalityPreferences = personalityPreferences;
        this.price = price;
    }
}

export { Gift };

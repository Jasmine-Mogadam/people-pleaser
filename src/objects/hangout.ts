import { EntityKindEnum, GameEntity, type EntityKind } from "./entity";
import type { Personality } from "./personality";

class Hangout extends GameEntity {
    readonly kind: EntityKind = EntityKindEnum.Hangout;
    personalityPreferences: Personality[];
    /** How many people can come along at once. */
    capacity: number;
    /** Charged per attendee when you go. */
    costPerPerson: number;

    // Image is looked up from the name now, so it is not a constructor argument.
    constructor(
        name: string,
        personalityPreferences: Personality[],
        capacity: number,
        costPerPerson: number,
        description: string,
    ) {
        super(name, description);
        this.personalityPreferences = personalityPreferences;
        this.capacity = capacity;
        this.costPerPerson = costPerPerson;
    }
}

export { Hangout };

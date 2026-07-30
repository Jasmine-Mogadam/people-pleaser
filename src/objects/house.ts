import { findImage, slugify } from "./entity";

/**
 * Somewhere to live. Roommates are stored in redux by id, not here -- this is
 * catalog data and has to stay free of per-save state.
 */
class House {
    name: string;
    price: number;
    maxRoomates: number;
    /** Where to draw each roommate, as a percentage of the room. */
    roomatePositions: { x: number; y: number }[];

    constructor(
        name: string,
        price: number,
        maxRoomates: number,
        roomatePositions: { x: number; y: number }[],
    ) {
        this.name = name;
        this.price = price;
        this.maxRoomates = maxRoomates;
        this.roomatePositions = roomatePositions;
    }

    get id(): string {
        return slugify(this.name);
    }

    get image(): string | undefined {
        return findImage("house", this.id);
    }
}
export { House };

// Positions are percentages of the room, so they scale with the background.
export const AllHouses: House[] = [
    new House("Cramped Apartment", 0, 0, []),
    new House("Little House", 1000, 2, [
        { x: 30, y: 55 },
        { x: 60, y: 55 },
    ]),
    new House("Big House", 5000, 4, [
        { x: 20, y: 45 },
        { x: 45, y: 45 },
        { x: 20, y: 70 },
        { x: 45, y: 70 },
    ]),
];

export function getHouse(id: string): House {
    return AllHouses.find((h) => h.id === id) ?? AllHouses[0];
}

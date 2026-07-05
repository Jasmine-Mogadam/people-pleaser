import type { Friend } from "./friend";

class House {
    price: number;
    maxRoomates: number;
    roomates: Friend[];
    image: string;
    roomatePositions: { x: number, y: number }[];
    constructor(
        price: number,
        maxRoomates: number,
        image: string,
        roomatePositions: { x: number, y: number }[]
    ) {
        this.price = price;
        this.maxRoomates = maxRoomates;
        this.roomates = [];
        this.image = image;
        this.roomatePositions = roomatePositions;
    }
}
export { type House };

export const AllHouses: House[] = [
    new House(
        0,
        0,
        "cramped_apartment.png",
        [{ x: 0, y: 0 }]
    ),
    new House(
        1000,
        2,
        "little_house.png",
        [{ x: 0, y: 0 }, { x: 1, y: 0 }]
    ),
    new House(
        5000,
        5,
        "big_house.png",
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    ),
]
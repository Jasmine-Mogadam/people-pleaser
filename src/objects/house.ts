abstract class House {
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

export class CrampedApartment extends House {
    constructor() {
        super(
            0,
            0,
            "cramped_apartment.png",
            [{ x: 0, y: 0 }]
        );
    }
}

export class LittleHouse extends House {
    constructor() {
        super(
            1000,
            2,
            "little_house.png",
            [{ x: 0, y: 0 }, { x: 1, y: 0 }]
        );
    }
}

export class BigHouse extends House {
    constructor() {
        super(
            5000,
            5,
            "big_house.png",
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
        );
    }
}
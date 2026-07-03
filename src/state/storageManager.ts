import type { Friend } from "../objects/friend";

abstract class StorageManager<T> {
    private key: StorageKey;
    constructor(key: StorageKey) {
        this.key = key;
    }

    getItem(): T | null {
        const item = localStorage.getItem(this.key);
        if (item) {
            try {
                return JSON.parse(item) as T;
            } catch (error) {
                console.error(`Error getting storage item for this.key "${this.key}":`, error);
                return null;
            }
        }
        return null;
    }

    setItem(value: T): void {
        try {
            const item = JSON.stringify(value);
            localStorage.setItem(this.key, item);
        } catch (error) {
            console.error(`Error setting storage item for this.key "${this.key}":`, error);
        }
    }
}

const StorageKey = {
    INVENTORY: "INVENTORY",
    FRIENDS: "FRIENDS",
    MONEY: "MONEY",
    HOUSE: "HOUSE",
    DISCOVERED_HANGOUTS: "DISCOVERED_HANGOUTS",
    PLAYER_CHARACTER: "PLAYER_CHARACTER",
}
// there is absolutely no need to make this as ridculuos as it is but whatever at this point aaaaaaa
type StorageKey = typeof StorageKey[keyof typeof StorageKey];

export class InventoryStorageManager extends StorageManager<InventoryItem[]> {
    constructor() {
        super(StorageKey.INVENTORY);
    }
}
export class FriendStorageManager extends StorageManager<Friend[]> {
    constructor() {
        super(StorageKey.FRIENDS);
    }
}
export class MoneyStorageManager extends StorageManager<number> {
    constructor() {
        super(StorageKey.MONEY);
    }
}
export class HouseStorageManager extends StorageManager<House> {
    constructor() {
        super(StorageKey.HOUSE);
    }
}
export class DiscoveredHangoutsStorageManager extends StorageManager<string[]> {
    constructor() {
        super(StorageKey.DISCOVERED_HANGOUTS);
    }
}
export class PlayerCharacterStorageManager extends StorageManager<Friend> {
    constructor() {
        super(StorageKey.PLAYER_CHARACTER);
    }
}

// I just realized making the enum is entirely pointless since it's never accessed outside of this file.....
// ssSSHHHHHHHHHhhhhhh-eeehhhhmmmm mm m
// 15 minutes well spent B)

export function hasGameData(): boolean {
    const inventoryManager = new InventoryStorageManager();
    const friendsManager = new FriendStorageManager();
    const moneyManager = new MoneyStorageManager();
    const houseManager = new HouseStorageManager();
    const discoveredHangoutsManager = new DiscoveredHangoutsStorageManager();
    const playerCharacterManager = new PlayerCharacterStorageManager();

    return (
        inventoryManager.getItem() !== null &&
        friendsManager.getItem() !== null &&
        moneyManager.getItem() !== null &&
        houseManager.getItem() !== null &&
        discoveredHangoutsManager.getItem() !== null &&
        playerCharacterManager.getItem() !== null
    );
}

export var state: any;
export function loadState(): void {
    const inventoryManager = new InventoryStorageManager();
    const friendsManager = new FriendStorageManager();
    const moneyManager = new MoneyStorageManager();
    const houseManager = new HouseStorageManager();
    const discoveredHangoutsManager = new DiscoveredHangoutsStorageManager();
    const playerCharacterManager = new PlayerCharacterStorageManager();


    const inventory = inventoryManager.getItem();
    const friends = friendsManager.getItem();
    const money = moneyManager.getItem();
    const house = houseManager.getItem();
    const discoveredHangouts = discoveredHangoutsManager.getItem();
    const playerCharacter = playerCharacterManager.getItem();
    inventoryManager.setItem(inventory || []);
    friendsManager.setItem(friends || []);
    moneyManager.setItem(money || 0);
    houseManager.setItem(house || new CrampedApartment());
    discoveredHangoutsManager.setItem(discoveredHangouts || []);
}
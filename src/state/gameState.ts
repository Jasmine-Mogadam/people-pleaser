import type { Friend } from "../objects/friend";
import type { Gift } from "../objects/gift";
import type { Hangout } from "../objects/hangout";
import { AllHouses, type House } from "../objects/house";
import { actionPointsSlice, currentWeekSlice, discoveredHangoutsSlice, friendsSlice, houseSlice, inventorySlice, moneySlice, setActionPoints, setCurrentWeek, setDiscoveredHangouts, setFriends, setHouse, setInventory, setMoney } from "./gameStateSlice";
import store from "./store";

const { inventory, friends, money, house, discoveredHangouts, currentWeek, actionPoints } = store.getState();

export interface State {
    inventory: Gift[];
    friends: Friend[];
    money: number;
    house: House;
    discoveredHangouts: Hangout[];
    currentWeek: number;
    actionPoints: number;
}

export function loadGameState(): void {
    const item = localStorage.getItem("state");
    if (item) {
        try {
            const state = JSON.parse(item) as State;
            inventorySlice.actions.setInventory(state.inventory);
            friendsSlice.actions.setFriends(state.friends);
            moneySlice.actions.setMoney(state.money);
            houseSlice.actions.setHouse(state.house);
            discoveredHangoutsSlice.actions.setDiscoveredHangouts(state.discoveredHangouts);
            currentWeekSlice.actions.setCurrentWeek(state.currentWeek);
            actionPointsSlice.actions.setActionPoints(state.actionPoints);
        } catch (error) {
            console.error(`Error loading state":`, error);
        }
    }
}

export function saveGameState(): void {
    const state: State = {
        inventory: inventory,
        friends: friends,
        money: money,
        house: house,
        discoveredHangouts: discoveredHangouts,
        currentWeek: currentWeek,
        actionPoints: actionPoints
    };
    try {
        const item = JSON.stringify(state);
        localStorage.setItem("state", item);
    } catch (error) {
        console.error(`Error saving state":`, error);
    }
}

export function newGameState(): void {
    setInventory([])
    setFriends([])
    setMoney(100)
    setHouse(AllHouses[0])
    setDiscoveredHangouts([])
    setCurrentWeek(0)
    setActionPoints(5)
    saveGameState();
}

// checks for the root state in storage
export function hasGameData(): boolean {
    return localStorage.getItem("state") !== null;
}
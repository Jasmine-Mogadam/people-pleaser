import type { Friend } from "../objects/friend";
import type { Gift } from "../objects/gift";
import type { Hangout } from "../objects/hangout";
import type { House } from "../objects/house";
import { actionPointsSlice, currentWeekSlice, discoveredHangoutsSlice, friendsSlice, houseSlice, inventorySlice, moneySlice, playerCharacterSlice } from "./gameStateSlice";
import store from "./store";

const { inventory, friends, money, house, discoveredHangouts, playerCharacter, currentWeek, actionPoints } = store.getState();

export interface State {
    inventory: Gift[];
    friends: Friend[];
    money: number;
    house: House;
    discoveredHangouts: Hangout[];
    playerCharacter: Friend | null;
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
            playerCharacterSlice.actions.setPlayerCharacter(state.playerCharacter);
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
        playerCharacter: playerCharacter,
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

// if you don't have a character for some reason the other states are kinda moot
export function hasGameData(): boolean {
    return (
        playerCharacter !== null
    );
}
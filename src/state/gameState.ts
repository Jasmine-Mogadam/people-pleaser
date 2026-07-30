import { AllHouses } from "../objects/house";
import { BASE_ACTION_POINTS, STARTING_HANGOUTS, STARTING_MONEY } from "../game/rules";
import {
    setActionPoints,
    setCurrentWeek,
    setDiscoveredHangouts,
    setFriends,
    setHistory,
    setHouseState,
    setInventory,
    setJob,
    setMoney,
    setSettings,
    setUpgrades,
    setWeeklyInteractions,
    type FriendRecord,
    type HistoryEntry,
    type HouseState,
    type JobState,
    type SettingsState,
} from "./gameStateSlice";
import store from "./store";

const SAVE_KEY = "state";

export interface State {
    inventory: string[];
    friends: FriendRecord[];
    money: number;
    house: HouseState;
    discoveredHangouts: string[];
    currentWeek: number;
    actionPoints: number;
    job: JobState;
    upgrades: string[];
    settings: SettingsState;
    weeklyInteractions: Record<string, number>;
    history: HistoryEntry[];
}

/**
 * Reads the save into the store. Every one of these has to go through
 * store.dispatch -- calling an action creator on its own just builds a plain
 * object and throws it away, which is why saves used to never load.
 */
export function loadGameState(): boolean {
    const item = localStorage.getItem(SAVE_KEY);
    if (!item) return false;
    try {
        const state = JSON.parse(item) as Partial<State>;
        store.dispatch(setInventory(state.inventory ?? []));
        store.dispatch(setFriends(state.friends ?? []));
        store.dispatch(setMoney(state.money ?? STARTING_MONEY));
        store.dispatch(setHouseState(state.house ?? { id: AllHouses[0].id, roommateIds: [] }));
        store.dispatch(setDiscoveredHangouts(state.discoveredHangouts ?? [...STARTING_HANGOUTS]));
        store.dispatch(setCurrentWeek(state.currentWeek ?? 0));
        store.dispatch(setActionPoints(state.actionPoints ?? BASE_ACTION_POINTS));
        store.dispatch(setJob(state.job ?? { promotions: 0, shiftsWorked: 0 }));
        store.dispatch(setUpgrades(state.upgrades ?? []));
        store.dispatch(setSettings(state.settings ?? {}));
        store.dispatch(setWeeklyInteractions(state.weeklyInteractions ?? {}));
        // Carried across saves on purpose: the History app is a log of the run.
        store.dispatch(setHistory(state.history ?? []));
        return true;
    } catch (error) {
        console.error(`Error loading state":`, error);
        return false;
    }
}

/** Snapshots the store as it is right now, not as it was when this module loaded. */
export function saveGameState(): void {
    const state = store.getState();
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error(`Error saving state":`, error);
    }
}

export function newGameState(): void {
    store.dispatch(setInventory([]));
    store.dispatch(setFriends([]));
    store.dispatch(setMoney(STARTING_MONEY));
    store.dispatch(setHouseState({ id: AllHouses[0].id, roommateIds: [] }));
    store.dispatch(setDiscoveredHangouts([...STARTING_HANGOUTS]));
    store.dispatch(setCurrentWeek(0));
    store.dispatch(setActionPoints(BASE_ACTION_POINTS));
    store.dispatch(setJob({ promotions: 0, shiftsWorked: 0 }));
    store.dispatch(setUpgrades([]));
    store.dispatch(setWeeklyInteractions({}));
    store.dispatch(setHistory([]));
    // Accessibility settings deliberately survive starting over.
    saveGameState();
}

export function clearGameData(): void {
    localStorage.removeItem(SAVE_KEY);
}

// checks for the root state in storage
export function hasGameData(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
}

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AllHouses } from "../objects/house";

/**
 * Everything in here has to survive JSON.stringify, so state refers to catalog
 * content by id ("benny", "retro_arcade") instead of holding the objects. The
 * old shape stored Friend instances whose preferences pointed at each other,
 * which made saving throw on a circular structure.
 */

/** What the player has learned and earned about one character. */
export interface FriendRecord {
    id: string;
    friendshipLevel: number;
    /** Preference keys the player has uncovered, e.g. "hangout:art_museum". */
    discoveredPreferences: string[];
}

export interface HouseState {
    id: string;
    roommateIds: string[];
}

export interface JobState {
    /** Raises earned so far. */
    promotions: number;
    /** Overtime shifts worked toward the next raise. */
    shiftsWorked: number;
}

export interface SettingsState {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
}

export const MAX_FRIENDSHIP = 100;

export function makeFriendRecord(id: string): FriendRecord {
    return { id, friendshipLevel: 0, discoveredPreferences: [] };
}

export const inventorySlice = createSlice({
    name: "inventory",
    initialState: [] as string[],
    reducers: {
        getItem: (state, action: PayloadAction<string>) => {
            state.push(action.payload);
        },
        giftItem: (state, action: PayloadAction<string>) => {
            const index = state.indexOf(action.payload);
            if (index === -1) {
                console.error(`Tried to gift ${action.payload}, but it was not in the inventory.`);
                return state;
            }
            state.splice(index, 1);
            return state;
        },
        setInventory: (_state, action: PayloadAction<string[]>) => {
            return action.payload;
        },
    },
});
export const { getItem, giftItem, setInventory } = inventorySlice.actions;

export const friendsSlice = createSlice({
    name: "friends",
    initialState: [] as FriendRecord[],
    reducers: {
        discoverFriend: (state, action: PayloadAction<string>) => {
            if (state.some(friend => friend.id === action.payload)) {
                console.warn(`Friend ${action.payload} has already been met.`);
                return state;
            }
            state.push(makeFriendRecord(action.payload));
            return state;
        },
        /** Adds friendship, or subtracts it with a negative amount. Clamped to 0-100. */
        addFriendship: (state, action: PayloadAction<{ id: string; amount: number }>) => {
            const friend = state.find(f => f.id === action.payload.id);
            if (!friend) {
                console.error(`Tried to change friendship for ${action.payload.id}, who has not been met.`);
                return state;
            }
            friend.friendshipLevel = Math.max(
                0,
                Math.min(friend.friendshipLevel + action.payload.amount, MAX_FRIENDSHIP),
            );
            return state;
        },
        revealPreference: (state, action: PayloadAction<{ id: string; key: string }>) => {
            const friend = state.find(f => f.id === action.payload.id);
            if (!friend) return state;
            if (!friend.discoveredPreferences.includes(action.payload.key)) {
                friend.discoveredPreferences.push(action.payload.key);
            }
            return state;
        },
        setFriends: (_state, action: PayloadAction<FriendRecord[]>) => {
            return action.payload;
        },
    },
});
export const { discoverFriend, addFriendship, revealPreference, setFriends } = friendsSlice.actions;

export const moneySlice = createSlice({
    name: "money",
    initialState: 0 as number,
    reducers: {
        setMoney: (_state, action: PayloadAction<number>) => {
            return action.payload;
        },
        // Negative amounts spend. Callers are expected to check affordability first.
        addMoney: (state, action: PayloadAction<number>) => {
            return state + action.payload;
        },
    },
});
export const { setMoney, addMoney } = moneySlice.actions;

export const houseSlice = createSlice({
    name: "house",
    initialState: { id: AllHouses[0].id, roommateIds: [] } as HouseState,
    reducers: {
        setHouse: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
            return state;
        },
        addRoommate: (state, action: PayloadAction<string>) => {
            if (!state.roommateIds.includes(action.payload)) state.roommateIds.push(action.payload);
            return state;
        },
        removeRoommate: (state, action: PayloadAction<string>) => {
            state.roommateIds = state.roommateIds.filter(id => id !== action.payload);
            return state;
        },
        setHouseState: (_state, action: PayloadAction<HouseState>) => {
            return action.payload;
        },
    },
});
export const { setHouse, addRoommate, removeRoommate, setHouseState } = houseSlice.actions;

export const discoveredHangoutsSlice = createSlice({
    name: "discoveredHangouts",
    initialState: [] as string[],
    reducers: {
        discoverHangout: (state, action: PayloadAction<string>) => {
            if (state.includes(action.payload)) return state;
            state.push(action.payload);
            return state;
        },
        setDiscoveredHangouts: (_state, action: PayloadAction<string[]>) => {
            return action.payload;
        },
    },
});
export const { discoverHangout, setDiscoveredHangouts } = discoveredHangoutsSlice.actions;

export const currentWeekSlice = createSlice({
    name: "currentWeek",
    initialState: 0 as number,
    reducers: {
        setCurrentWeek: (_state, action: PayloadAction<number>) => {
            return action.payload;
        },
        // state++ evaluates to the week we just left, so this has to be state + 1.
        nextWeek: (state) => {
            return state + 1;
        },
    },
});
export const { setCurrentWeek, nextWeek } = currentWeekSlice.actions;

export const actionPointsSlice = createSlice({
    name: "actionPoints",
    initialState: 0 as number,
    reducers: {
        setActionPoints: (_state, action: PayloadAction<number>) => {
            return action.payload;
        },
        spendActionPoints: (state, action: PayloadAction<number>) => {
            return Math.max(0, state - action.payload);
        },
    },
});
export const { setActionPoints, spendActionPoints } = actionPointsSlice.actions;

export const jobSlice = createSlice({
    name: "job",
    initialState: { promotions: 0, shiftsWorked: 0 } as JobState,
    reducers: {
        workShift: (state) => {
            state.shiftsWorked += 1;
            return state;
        },
        promote: (state) => {
            state.promotions += 1;
            state.shiftsWorked = 0;
            return state;
        },
        setJob: (_state, action: PayloadAction<JobState>) => {
            return action.payload;
        },
    },
});
export const { workShift, promote, setJob } = jobSlice.actions;

export const upgradesSlice = createSlice({
    name: "upgrades",
    initialState: [] as string[],
    reducers: {
        buyUpgrade: (state, action: PayloadAction<string>) => {
            if (state.includes(action.payload)) return state;
            state.push(action.payload);
            return state;
        },
        setUpgrades: (_state, action: PayloadAction<string[]>) => {
            return action.payload;
        },
    },
});
export const { buyUpgrade, setUpgrades } = upgradesSlice.actions;

export const defaultSettings: SettingsState = {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState: defaultSettings,
    reducers: {
        toggleSetting: (state, action: PayloadAction<keyof SettingsState>) => {
            state[action.payload] = !state[action.payload];
            return state;
        },
        // Spread the defaults so a save from an older build gains any new setting.
        setSettings: (_state, action: PayloadAction<Partial<SettingsState>>) => {
            return { ...defaultSettings, ...action.payload };
        },
    },
});
export const { toggleSetting, setSettings } = settingsSlice.actions;

/** One thing that happened, as shown in the phone's History app. */
export interface HistoryEntry {
    id: number;
    week: number;
    title: string;
    lines: string[];
}

/** Old weeks are worth keeping, but not without limit. */
const HISTORY_LIMIT = 400;

export const historySlice = createSlice({
    name: "history",
    initialState: [] as HistoryEntry[],
    reducers: {
        addHistory: (state, action: PayloadAction<Omit<HistoryEntry, "id">>) => {
            const id = state.length > 0 ? state[state.length - 1].id + 1 : 0;
            state.push({ ...action.payload, id });
            if (state.length > HISTORY_LIMIT) state.splice(0, state.length - HISTORY_LIMIT);
            return state;
        },
        setHistory: (_state, action: PayloadAction<HistoryEntry[]>) => {
            return action.payload;
        },
    },
});
export const { addHistory, setHistory } = historySlice.actions;

/**
 * How many times you have already interacted with each friend this week. Drives
 * diminishing returns, so spamming one person is never the best strategy.
 */
export const weeklyInteractionsSlice = createSlice({
    name: "weeklyInteractions",
    initialState: {} as Record<string, number>,
    reducers: {
        recordInteraction: (state, action: PayloadAction<string>) => {
            state[action.payload] = (state[action.payload] ?? 0) + 1;
            return state;
        },
        setWeeklyInteractions: (_state, action: PayloadAction<Record<string, number>>) => {
            return action.payload;
        },
    },
});
export const { recordInteraction, setWeeklyInteractions } = weeklyInteractionsSlice.actions;

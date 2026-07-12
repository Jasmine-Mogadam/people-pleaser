import type { Friend } from "../objects/friend";
import { AllHouses, type House } from "../objects/house";
import type { Gift } from "../objects/gift";
import type { Hangout } from "../objects/hangout";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const inventorySlice = createSlice({
    name: "inventory",
    initialState: [] as Gift[],
    reducers: {
        getItem: (state, action: PayloadAction<Gift>) => {
            state.push(action.payload);
        },
        giftItem: (state, action: PayloadAction<Gift>) => {
            const index = state.findIndex(item => item.name === action.payload.name);
            if (index === -1) {
                console.error(`Tried to gift ${action.payload.name}, but was not found in inventory.`);
                return;
            }
            state.splice(index, 1);
        },
        setInventory: (state, action: PayloadAction<Gift[]>) => {
            return action.payload;
        },
    },
});
export const { getItem, giftItem, setInventory } = inventorySlice.actions;

export const friendsSlice = createSlice({
    name: "friends",
    initialState: [] as Friend[],
    reducers: {
        discoverFriend: (state, action: PayloadAction<Friend>) => {
            const existingFriend = state.find(friend => friend.id === action.payload.id);
            if (existingFriend) {
                console.warn(`Friend with id ${action.payload.id} already exists in state.`);
                return;
            }
            state.push(action.payload);
        },
        updateFriend: (state, action: PayloadAction<Friend>) => {
            const index = state.findIndex(friend => friend.id === action.payload.id);
            if (index === -1) {
                console.error(`Tried to update friend with id ${action.payload.id}, but was not found in state.`);
                return;
            }
            state[index] = action.payload;
        },
        setFriends: (state, action: PayloadAction<Friend[]>) => {
            return action.payload;
        },
    },
});
export const { discoverFriend, updateFriend, setFriends } = friendsSlice.actions;

export const moneySlice = createSlice({
    name: "money",
    initialState: 0 as number,
    reducers: {
        setMoney: (state, action: PayloadAction<number>) => {
            return action.payload;
        },
        addMoney: (state, action: PayloadAction<number>) => {
            state += action.payload
        }
    },
});
export const { setMoney, addMoney } = moneySlice.actions;

export const houseSlice = createSlice({
    name: "house",
    initialState: AllHouses[0] as House,
    reducers: {
        setHouse: (state, action: PayloadAction<House>) => {
            return action.payload;
        },
    },
});
export const { setHouse } = houseSlice.actions;

export const discoveredHangoutsSlice = createSlice({
    name: "discoveredHangouts",
    initialState: [] as Hangout[],
    reducers: {
        setDiscoveredHangouts: (state, action: PayloadAction<Hangout[]>) => {
            return action.payload;
        },
    },
});
export const { setDiscoveredHangouts } = discoveredHangoutsSlice.actions;

export const playerCharacterSlice = createSlice({
    name: "playerCharacter",
    initialState: null as Friend | null,
    reducers: {
        setPlayerCharacter: (state, action: PayloadAction<Friend | null>) => {
            return action.payload;
        },
    },
});
export const { setPlayerCharacter } = playerCharacterSlice.actions;

export const weeksLeftSlice = createSlice({
    name: "money",
    initialState: 0 as number,
    reducers: {
        setWeeksLeft: (state, action: PayloadAction<number>) => {
            return action.payload;
        },
        nextWeek: (state, action: PayloadAction<number>) => {
            state--
        }
    },
});
export const { setWeeksLeft, nextWeek } = weeksLeftSlice.actions;
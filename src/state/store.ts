import { configureStore } from '@reduxjs/toolkit'
import {
    actionPointsSlice,
    currentWeekSlice,
    discoveredHangoutsSlice,
    friendsSlice,
    houseSlice,
    inventorySlice,
    jobSlice,
    moneySlice,
    settingsSlice,
    upgradesSlice,
    weeklyInteractionsSlice,
} from './gameStateSlice'

const store = configureStore({
    reducer: {
        inventory: inventorySlice.reducer,
        friends: friendsSlice.reducer,
        money: moneySlice.reducer,
        house: houseSlice.reducer,
        discoveredHangouts: discoveredHangoutsSlice.reducer,
        currentWeek: currentWeekSlice.reducer,
        actionPoints: actionPointsSlice.reducer,
        job: jobSlice.reducer,
        upgrades: upgradesSlice.reducer,
        settings: settingsSlice.reducer,
        weeklyInteractions: weeklyInteractionsSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

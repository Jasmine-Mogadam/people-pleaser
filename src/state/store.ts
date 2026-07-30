import { configureStore } from '@reduxjs/toolkit'
import { currentWeekSlice, actionPointsSlice, discoveredHangoutsSlice, friendsSlice, houseSlice, inventorySlice, moneySlice } from './gameStateSlice'

const store = configureStore({
    reducer: {
        inventory: inventorySlice.reducer,
        friends: friendsSlice.reducer,
        money: moneySlice.reducer,
        house: houseSlice.reducer,
        discoveredHangouts: discoveredHangoutsSlice.reducer,
        currentWeek: currentWeekSlice.reducer,
        actionPoints: actionPointsSlice.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

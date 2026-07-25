import { configureStore } from '@reduxjs/toolkit'
import { currentWeekSlice, actionPointsSlice, discoveredHangoutsSlice, friendsSlice, houseSlice, inventorySlice, moneySlice, playerCharacterSlice } from './gameStateSlice'

export default configureStore({
    reducer: {
        inventory: inventorySlice.reducer,
        friends: friendsSlice.reducer,
        money: moneySlice.reducer,
        house: houseSlice.reducer,
        discoveredHangouts: discoveredHangoutsSlice.reducer,
        playerCharacter: playerCharacterSlice.reducer,
        currentWeek: currentWeekSlice.reducer,
        actionPoints: actionPointsSlice.reducer
    },
})